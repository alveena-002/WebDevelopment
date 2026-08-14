import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import type { Appointment, Patient } from '@/lib/types';
import { Spinner, EmptyState, StatusBadge, RiskBadge, Avatar } from '@/components/ui';
import { cn, formatTime, formatDate } from '@/lib/utils';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Phone, Calendar, MessageSquare, Send } from 'lucide-react';

type CallState = 'idle' | 'connecting' | 'active' | 'ended';

interface SignalMessage {
  type: 'offer' | 'answer' | 'ice' | 'join' | 'leave';
  sdp?: string;
  candidate?: string;
  from: string;
}

export function VideoConsultations() {
  const { clinic, staff } = useAuth();
  const { show } = useToast();
  const [videoAppts, setVideoAppts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAppt, setActiveAppt] = useState<Appointment | null>(null);
  const [callState, setCallState] = useState<CallState>('idle');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<{ send: (msg: SignalMessage) => void; close: () => void } | null>(null);
  const userIdRef = useRef(staff?.id ?? crypto.randomUUID());

  useEffect(() => {
    if (!clinic) return;
    (async () => {
      const { data } = await supabase
        .from('appointments')
        .select('*, patient:patients(*), staff:clinic_staff(*)')
        .eq('clinic_id', clinic.id)
        .eq('type', 'video')
        .order('start_time', { ascending: true });
      setVideoAppts((data ?? []) as Appointment[]);
      setLoading(false);
    })();
  }, [clinic]);

  const setupPeerConnection = useCallback((roomId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    pcRef.current = pc;

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        channelRef.current?.send({ type: 'ice', candidate: JSON.stringify(e.candidate), from: userIdRef.current });
      }
    };

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
        remoteVideoRef.current.play().catch(() => {});
      }
    };

    // Broadcast presence and signalling via Supabase Realtime channel
    const channel = supabase.channel(`video-${roomId}`, {
      config: { broadcast: { self: false } },
    });

    channel.on('broadcast', { event: 'signal' }, (payload) => {
      const msg = payload.payload as SignalMessage;
      if (msg.from === userIdRef.current) return;
      handleSignal(msg, pc);
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channelRef.current = {
          send: (m: SignalMessage) => channel.send({ type: 'broadcast', event: 'signal', payload: m }),
          close: () => supabase.removeChannel(channel),
        };
        channelRef.current?.send({ type: 'join', from: userIdRef.current });
      }
    });

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current!));
    }

    return pc;
  }, []);

  const handleSignal = useCallback(async (msg: SignalMessage, pc: RTCPeerConnection) => {
    try {
      if (msg.type === 'join') {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        channelRef.current?.send({ type: 'offer', sdp: JSON.stringify(offer), from: userIdRef.current });
      } else if (msg.type === 'offer') {
        await pc.setRemoteDescription(JSON.parse(msg.sdp!));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        channelRef.current?.send({ type: 'answer', sdp: JSON.stringify(answer), from: userIdRef.current });
      } else if (msg.type === 'answer') {
        await pc.setRemoteDescription(JSON.parse(msg.sdp!));
      } else if (msg.type === 'ice') {
        await pc.addIceCandidate(JSON.parse(msg.candidate!));
      } else if (msg.type === 'leave') {
        endCall();
      }
    } catch {
      // signalling race conditions are common; ignore
    }
  }, []);

  async function startCall(appt: Appointment) {
    setActiveAppt(appt);
    setCallState('connecting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
      }
      setupPeerConnection(appt.id);
      setCallState('active');
      show('Video consultation started');
    } catch {
      show('Could not access camera/microphone', 'error');
      setCallState('idle');
      setActiveAppt(null);
    }
  }

  function endCall() {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    channelRef.current?.send({ type: 'leave', from: userIdRef.current });
    channelRef.current?.close();
    channelRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setCallState('ended');
  }

  function closeCallUI() {
    endCall();
    setCallState('idle');
    setActiveAppt(null);
  }

  useEffect(() => () => endCall(), []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Spinner className="h-7 w-7 text-brand-500" /></div>;
  }

  // Active call view
  if (callState !== 'idle' && activeAppt) {
    return (
      <CallView
        appt={activeAppt}
        callState={callState}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        onEnd={closeCallUI}
        roomId={activeAppt.id}
        userId={userIdRef.current}
      />
    );
  }

  // List view
  return (
    <div className="space-y-5 animate-fade-up">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Video className="h-6 w-6" />
          <h2 className="font-display text-xl font-bold">Video Consultations</h2>
        </div>
        <p className="text-sm text-brand-100 max-w-lg">
          Secure WebRTC video calling via Supabase Realtime. Start a consultation with one click — patients can join from their browser without any downloads.
        </p>
      </div>

      {videoAppts.length === 0 ? (
        <div className="card">
          <EmptyState icon={<Video className="h-7 w-7" />} title="No video appointments" description="Book a video appointment to enable consultations here." />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videoAppts.map((a) => (
            <div key={a.id} className="card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <Avatar name={`${a.patient?.first_name} ${a.patient?.last_name}`} size="md" />
                <StatusBadge status={a.status} />
              </div>
              <div className="text-base font-semibold text-ink-800">
                {a.patient?.first_name} {a.patient?.last_name}
              </div>
              <div className="text-xs text-ink-400 mb-3">{a.reason}</div>
              <div className="flex items-center gap-2 text-xs text-ink-500 mb-4">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(a.start_time)} · {formatTime(a.start_time)}
              </div>
              {a.status === 'scheduled' ? (
                <button onClick={() => startCall(a)} className="btn-primary w-full">
                  <Video className="h-4 w-4" /> Start consultation
                </button>
              ) : (
                <button disabled className="btn-secondary w-full opacity-60">
                  {a.status === 'completed' ? 'Completed' : a.status === 'cancelled' ? 'Cancelled' : 'No-show'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CallView({
  appt,
  callState,
  localVideoRef,
  remoteVideoRef,
  onEnd,
  roomId,
  userId,
}: {
  appt: Appointment;
  callState: CallState;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  onEnd: () => void;
  roomId: string;
  userId: string;
}) {
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [messages, setMessages] = useState<{ from: string; text: string; ts: number }[]>([]);
  const [chatText, setChatText] = useState('');
  const [remoteJoined, setRemoteJoined] = useState(false);
  const chatChannelRef = useRef<{ send: (m: { from: string; text: string; ts: number }) => void; close: () => void } | null>(null);

  // Monitor remote track
  useEffect(() => {
    const check = setInterval(() => {
      const remote = remoteVideoRef.current?.srcObject as MediaStream | null;
      setRemoteJoined(!!remote && remote.getVideoTracks().length > 0);
    }, 1000);
    return () => clearInterval(check);
  }, [remoteVideoRef]);

  // Chat channel
  useEffect(() => {
    const ch = supabase.channel(`chat-${roomId}`, { config: { broadcast: { self: false } } });
    ch.on('broadcast', { event: 'chat' }, (payload) => {
      setMessages((prev) => [...prev, payload.payload as { from: string; text: string; ts: number }]);
    });
    ch.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        chatChannelRef.current = {
          send: (m) => ch.send({ type: 'broadcast', event: 'chat', payload: m }),
          close: () => supabase.removeChannel(ch),
        };
      }
    });
    return () => { chatChannelRef.current?.close(); };
  }, [roomId]);

  function toggleMute() {
    const stream = localVideoRef.current?.srcObject as MediaStream | null;
    stream?.getAudioTracks().forEach((t) => (t.enabled = muted));
    setMuted(!muted);
  }

  function toggleVideo() {
    const stream = localVideoRef.current?.srcObject as MediaStream | null;
    stream?.getVideoTracks().forEach((t) => (t.enabled = !videoOn));
    setVideoOn(!videoOn);
  }

  function sendChat() {
    if (!chatText.trim()) return;
    const msg = { from: userId, text: chatText.trim(), ts: Date.now() };
    chatChannelRef.current?.send(msg);
    setMessages((prev) => [...prev, msg]);
    setChatText('');
  }

  const p = appt.patient as Patient | undefined;

  return (
    <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-200px)] animate-fade-up">
      {/* Video area */}
      <div className="lg:col-span-2 flex flex-col">
        <div className="relative flex-1 rounded-2xl bg-ink-900 overflow-hidden">
          {/* Remote video */}
          <video ref={remoteVideoRef} autoPlay playsInline className={cn('h-full w-full object-cover', !remoteJoined && 'opacity-0')} />
          {/* Waiting state */}
          {!remoteJoined && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="relative mb-4">
                <Avatar name={`${p?.first_name} ${p?.last_name}`} size="lg" />
                <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse-ring" />
              </div>
              <div className="text-lg font-semibold">{p?.first_name} {p?.last_name}</div>
              <div className="text-sm text-ink-300 mt-1">
                {callState === 'connecting' ? 'Connecting…' : 'Waiting for patient to join'}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
                <Phone className="h-3.5 w-3.5" />
                Share room link with patient
              </div>
            </div>
          )}
          {/* Local video PiP */}
          <div className="absolute bottom-4 right-4 h-28 w-40 sm:h-32 sm:w-48 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg bg-ink-800">
            <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
            {!videoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink-800">
                <VideoOff className="h-6 w-6 text-ink-400" />
              </div>
            )}
          </div>
          {/* Top info */}
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-ink-900/60 backdrop-blur px-3 py-1.5 text-white text-sm">
            <span className={cn('h-2 w-2 rounded-full', remoteJoined ? 'bg-brand-400' : 'bg-amber-400 animate-pulse')} />
            {remoteJoined ? 'Connected' : 'In session'}
          </div>
          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-2xl bg-ink-900/80 backdrop-blur px-3 py-2">
            <button onClick={toggleMute} className={cn('flex h-11 w-11 items-center justify-center rounded-xl transition-colors', muted ? 'bg-white text-ink-900' : 'bg-white/10 text-white hover:bg-white/20')}>
              {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <button onClick={toggleVideo} className={cn('flex h-11 w-11 items-center justify-center rounded-xl transition-colors', !videoOn ? 'bg-white text-ink-900' : 'bg-white/10 text-white hover:bg-white/20')}>
              {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
            <button onClick={onEnd} className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors">
              <PhoneOff className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Side panel */}
      <div className="flex flex-col rounded-2xl bg-white border border-ink-100 overflow-hidden">
        {/* Patient info */}
        <div className="border-b border-ink-100 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={`${p?.first_name} ${p?.last_name}`} size="md" />
            <div className="min-w-0">
              <div className="truncate font-semibold text-ink-800">{p?.first_name} {p?.last_name}</div>
              <div className="text-xs text-ink-400">{appt.reason}</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={appt.status} />
            <RiskBadge risk={appt.no_show_risk} />
          </div>
          {p?.allergies && p.allergies !== 'None' && (
            <div className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-2.5 py-1.5">Allergies: {p.allergies}</div>
          )}
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-600 border-b border-ink-100">
            <MessageSquare className="h-4 w-4" /> In-call chat
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-xs text-ink-400 py-6">No messages yet. Messages are shared with the patient in real time.</div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={cn('flex', m.from === userId ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[80%] rounded-xl px-3 py-2 text-sm', m.from === userId ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-700')}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-ink-100 p-3 flex gap-2">
            <input
              className="input flex-1"
              placeholder="Type a message…"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChat()}
            />
            <button onClick={sendChat} className="btn-primary px-3">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
