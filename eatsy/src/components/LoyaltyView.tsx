import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Send, Smartphone, Mail, Copy, Check, Award, Flame, Users, Zap, CheckCircle2 } from 'lucide-react';
import { Language, MarketingLog } from '../types';
import { i18nDict } from '../lib/i18n';

interface LoyaltyViewProps {
  language: Language;
}

export const LoyaltyView: React.FC<LoyaltyViewProps> = ({ language }) => {
  const t = i18nDict[language];

  const [customerName, setCustomerName] = useState('Sunaina Almas');
  const [customerEmail, setCustomerEmail] = useState('sunainaalmas725@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('+44 7700 900123');
  const [occasion, setOccasion] = useState('Rainy Evening Pub Visit');
  const [favoriteCategory, setFavoriteCategory] = useState('Pub Classics & Sunday Roast');

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiOffer, setAiOffer] = useState<{
    promoCode: string;
    discountTitle: string;
    smsCopy: string;
    emailSubject: string;
    emailBody: string;
    targetPerks: string[];
  } | null>({
    promoCode: 'EATSY-N20-SUNAINA',
    discountTitle: '20% Off Your Next High-Street Feast',
    smsCopy: 'Hi Sunaina! Enjoy 20% OFF at The Red Lion & Kitchen today! Use code EATSY-N20-SUNAINA at QR table checkout. Saved 30% direct with Eatsy!',
    emailSubject: 'Exclusive UK Pub & Cafe Offer for Sunaina!',
    emailBody: 'Dear Sunaina,\n\nWe love having you at The Red Lion & Kitchen! As a valued guest, here is an exclusive 20% voucher: EATSY-N20-SUNAINA.\n\nOrder via QR code on your phone to skip the queue & get instant table delivery!\n\nWarm regards,\nThe Eatsy High-Street Team',
    targetPerks: ['20% Off Bill', 'Free Artisan Coffee Upgrade', 'Priority Table Delivery'],
  });

  const [isSending, setIsSending] = useState(false);
  const [dispatchLogs, setDispatchLogs] = useState<MarketingLog[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  // Fetch marketing logs from backend
  useEffect(() => {
    fetch('/api/marketing/logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) setDispatchLogs(data.logs);
      })
      .catch((err) => console.error('Failed to load logs', err));
  }, []);

  const handleGenerateAiOffer = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          occasion,
          favoriteCategory,
          visitCount: 5,
          language,
        }),
      });
      const data = await res.json();
      setAiOffer(data);
    } catch (err) {
      console.error('AI Offer generation error', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDispatchCampaign = async (channel: 'SMS' | 'Email') => {
    if (!aiOffer) return;
    setIsSending(true);

    try {
      const res = await fetch('/api/marketing/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          recipient: channel === 'SMS' ? customerPhone : customerEmail,
          offerCode: aiOffer.promoCode,
          messageText: channel === 'SMS' ? aiOffer.smsCopy : aiOffer.emailBody,
        }),
      });
      const data = await res.json();
      if (data.log) {
        setDispatchLogs((prev) => [data.log, ...prev]);
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 text-slate-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Customer Loyalty & Rewards System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif">
              {t.aiLoyalty}
            </h1>
            <p className="text-orange-100 text-sm leading-relaxed font-medium">
              Generate personalized UK dining offers for guests, dispatch via SMS or Email notifications, and manage customer referral cashback rewards!
            </p>
          </div>

          {/* Loyalty Points Card */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl min-w-[240px] text-center space-y-1">
            <p className="text-xs text-orange-100 uppercase font-bold tracking-wider">{t.pointsBalance}</p>
            <p className="text-3xl font-black text-white font-mono">185 PTS</p>
            <div className="inline-flex items-center gap-1 bg-white text-orange-600 px-3 py-1 rounded-full text-xs font-black shadow-sm">
              <Award className="w-3.5 h-3.5" />
              <span>Silver Foodie Tier</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Personal Offer Generator */}
        <div className="lg:col-span-7 bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Personalized Offer Generator</h2>
                <p className="text-xs text-slate-500 font-medium">Generates custom dining perks tailored to guest habits</p>
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 font-bold">Guest Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl p-3 mt-1 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold">Occasion / Timing</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl p-3 mt-1 focus:outline-none focus:border-orange-500"
                >
                  <option value="Rainy Evening Pub Visit">Rainy Evening Pub Visit</option>
                  <option value="Family Sunday Roast Special">Family Sunday Roast Special</option>
                  <option value="Post-Work Craft Beer Hour">Post-Work Craft Beer Hour</option>
                  <option value="Midweek Express Lunch">Midweek Express Lunch</option>
                  <option value="Weekend Breakfast & Coffee">Weekend Breakfast & Coffee</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-600 font-bold">Favorite Dish Category</label>
              <select
                value={favoriteCategory}
                onChange={(e) => setFavoriteCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl p-3 mt-1 focus:outline-none focus:border-orange-500"
              >
                <option value="Pub Classics & Sunday Roast">Pub Classics & Sunday Roast</option>
                <option value="Halal Angus Smash Burgers">Halal Angus Smash Burgers</option>
                <option value="Chicken Tikka Masala & Asian Mains">Chicken Tikka Masala & Asian Mains</option>
                <option value="Artisan Flat White & Bakery">Artisan Flat White & Bakery</option>
                <option value="Craft IPA & Ales">Craft IPA & Ales</option>
              </select>
            </div>

            <button
              onClick={handleGenerateAiOffer}
              disabled={isGenerating}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-orange-200 transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              {isGenerating ? (
                <span>Generating Personal Offer...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.generateAIOffer}</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Offer Preview */}
          {aiOffer && (
            <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200 space-y-4">
              <div className="flex items-center justify-between border-b border-orange-200/80 pb-3">
                <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">
                  Special Promotional Campaign
                </span>
                <button
                  onClick={() => handleCopyCode(aiOffer.promoCode)}
                  className="flex items-center gap-1 text-xs bg-orange-200 text-orange-800 hover:bg-orange-300 px-3 py-1 rounded-xl border border-orange-300 cursor-pointer font-bold"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? t.codeCopied : t.copyCode}</span>
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">{aiOffer.discountTitle}</h3>
                <p className="text-xs text-orange-600 font-mono font-black mt-0.5">Code: {aiOffer.promoCode}</p>
              </div>

              {/* Perks */}
              <div className="flex flex-wrap gap-2 text-xs">
                {aiOffer.targetPerks?.map((perk, i) => (
                  <span key={i} className="bg-white border border-orange-200 text-slate-800 px-2.5 py-1 rounded-xl flex items-center gap-1 font-bold shadow-sm">
                    <Zap className="w-3 h-3 text-orange-500" />
                    <span>{perk}</span>
                  </span>
                ))}
              </div>

              {/* SMS Preview */}
              <div className="bg-white p-3 rounded-xl border border-orange-200 text-xs space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-orange-500" />
                  SMS Notification Preview
                </p>
                <p className="text-slate-700 italic font-medium">{aiOffer.smsCopy}</p>
              </div>

              {/* Send Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleDispatchCampaign('SMS')}
                  disabled={isSending}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                  <span>Send via SMS</span>
                </button>

                <button
                  onClick={() => handleDispatchCampaign('Email')}
                  disabled={isSending}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5 text-orange-400" />
                  <span>Send via Email</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Referral Code & Notification Dispatch Logs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Referral Card */}
          <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">{t.referralTitle}</h2>
                <p className="text-xs text-slate-500 font-medium">Share your custom code with UK foodies</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Your Unique High-Street Referral Code</p>
              <div className="bg-white border-2 border-orange-300 p-3 rounded-2xl font-mono text-lg font-black text-orange-600 tracking-wider shadow-sm">
                EATSY-N20-SUNAINA
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Give friends <strong className="text-emerald-600 font-bold">£5 off</strong> their first table order, get <strong className="text-emerald-600 font-bold">£5 bonus cashback</strong> in your Eatsy wallet!
              </p>
            </div>
          </div>

          {/* Notification Live Dispatch Logs */}
          <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-md space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-orange-500" />
              <span>Notification Dispatch Logs</span>
            </h2>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-60 overflow-y-auto space-y-3 divide-y divide-slate-200">
              {dispatchLogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 font-medium">No marketing messages dispatched yet.</p>
              ) : (
                dispatchLogs.map((log) => (
                  <div key={log.id} className="pt-2 first:pt-0 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{log.channel} • {log.recipient}</span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                        {log.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2 font-medium">{log.messageText}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
