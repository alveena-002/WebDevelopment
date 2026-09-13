import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { Activity, ArrowRight, CalendarDays, Check, Clock3, LayoutDashboard, Leaf, Sparkles, Users, X } from "lucide-react";

/* Serene Studio direction: quiet luxury meets operational clarity — warm mineral paper, ink blue, saffron, and indigo; use airy editorial space with one tactile booking control as the conversion anchor. */

type ClassItem = {
  name: string;
  teacher: string;
  time: string;
  duration: string;
  level: string;
  spots: number;
  tone: "saffron" | "sage" | "indigo";
};

const timetable: Record<string, ClassItem[]> = {
  Today: [
    { name: "Slow Flow", teacher: "Maya Patel", time: "08:15", duration: "60 min", level: "All levels", spots: 4, tone: "saffron" },
    { name: "Core + Restore", teacher: "Nia James", time: "12:30", duration: "45 min", level: "Steady", spots: 7, tone: "sage" },
    { name: "Candlelight Yin", teacher: "Orla Reed", time: "18:45", duration: "75 min", level: "Slow", spots: 2, tone: "indigo" },
  ],
  "Wed 15": [
    { name: "Morning Mobility", teacher: "Nia James", time: "07:30", duration: "45 min", level: "All levels", spots: 9, tone: "sage" },
    { name: "Strong Vinyasa", teacher: "Maya Patel", time: "17:45", duration: "60 min", level: "Steady", spots: 5, tone: "saffron" },
    { name: "Moonlit Restore", teacher: "Orla Reed", time: "20:00", duration: "75 min", level: "Slow", spots: 3, tone: "indigo" },
  ],
  "Thu 16": [
    { name: "Rise + Breathe", teacher: "Maya Patel", time: "08:00", duration: "60 min", level: "All levels", spots: 6, tone: "saffron" },
    { name: "Pilates Mat", teacher: "Nia James", time: "13:15", duration: "50 min", level: "Steady", spots: 8, tone: "sage" },
    { name: "Yin + Sound", teacher: "Orla Reed", time: "19:15", duration: "75 min", level: "Slow", spots: 1, tone: "indigo" },
  ],
};

const featureCards = [
  { icon: CalendarDays, number: "01", title: "Capacity stays visible", body: "Give every class a clear limit, a waitlist state, and a useful next action for the front desk." },
  { icon: Users, number: "02", title: "Teachers arrive informed", body: "Keep member notes, attendance, and regulars in one warm, useful view before the room opens." },
  { icon: Sparkles, number: "03", title: "Follow-ups run themselves", body: "Automate reminders and post-class nudges so your team can spend the quiet moments on care." },
]; 

export default function YogaStudio() {
  const [selectedDay, setSelectedDay] = useState("Today");
  const [bookingClass, setBookingClass] = useState<ClassItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const classes = useMemo(() => timetable[selectedDay], [selectedDay]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Serene Studio — Your studio, in rhythm";
    return () => { document.title = previousTitle; };
  }, []);

  function openBooking(item: ClassItem) {
    setBookingClass(item);
    setConfirmed(false);
  }

  function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmed(true);
  }

  return (
    <div className="serene-page">
      <header className="serene-header">
        <a className="serene-brand" href="#top" aria-label="Serene Studio home">
          <img src="/manus-storage/serene-studio-mark_c9f820d2.png" alt="" />
          <span>serene<span>studio</span></span>
        </a>
        <nav className={mobileMenu ? "serene-nav open" : "serene-nav"}>
          <a href="#rhythm" onClick={() => setMobileMenu(false)}>The rhythm</a>
          <a href="#timetable" onClick={() => setMobileMenu(false)}>Timetable</a>
          <a href="#owners" onClick={() => setMobileMenu(false)}>For studio owners</a>
          <button className="serene-nav-book" onClick={() => document.getElementById("timetable")?.scrollIntoView({ behavior: "smooth" })}>Book a class <ArrowRight size={15} /></button>
        </nav>
        <button className="serene-menu-button" aria-label="Toggle menu" onClick={() => setMobileMenu(!mobileMenu)}><span /><span /></button>
      </header>

      <main id="top">
        <section className="serene-hero">
          <div className="serene-hero-copy">
            <p className="serene-kicker"><span /> Serene Studio OS / for boutique yoga</p>
            <h1>Run the room.<br /><em>Keep the practice.</em></h1>
            <p className="serene-hero-lede">The studio operating system for thoughtful movement teams. Fill classes, keep waitlists moving, and give teachers the context to make every visit feel personal.</p>
            <div className="serene-hero-actions"><a className="serene-button primary" href="#timetable">Explore the booking flow <ArrowRight size={16} /></a><a className="serene-text-link" href="#owners">See the owner view <ArrowRight size={15} /></a></div>
            <div className="serene-hero-notes"><span><Leaf size={13} /> East London</span><span>12 mats / room</span><span>07:00—21:00</span></div>
          </div>
          <div className="serene-hero-product" aria-label="Serene Studio operator dashboard preview"><div className="serene-product-window"><div className="serene-product-topbar"><div className="serene-product-dots"><i /><i /><i /></div><span><span className="serene-live-dot" /> SERENE STUDIO / OPERATOR VIEW</span><b>OR</b></div><div className="serene-product-layout"><aside className="serene-product-sidebar"><img src="/manus-storage/serene-studio-mark_c9f820d2.png" alt="" /><span className="active"><LayoutDashboard size={13} />Overview</span><span><CalendarDays size={13} />Timetable</span><span><Users size={13} />Members</span><span><Activity size={13} />Reports</span><small>OWNER MODE</small></aside><div className="serene-product-main"><div className="serene-product-heading"><div><small>TUESDAY / 14 MAY</small><h3>Good morning, Orla</h3></div><span className="serene-product-status">LIVE</span></div><div className="serene-metric-grid"><div><small>ACTIVE MEMBERS</small><strong>486</strong><span>+8.4% this month</span></div><div><small>TODAY’S VISITS</small><strong>72</strong><span>+12 vs Tuesday</span></div><div><small>CLASS FILL RATE</small><strong>84%</strong><span>3 waitlists moving</span></div></div><div className="serene-product-grid"><div className="serene-live-timetable"><div className="serene-product-panel-head"><span>LIVE TIMETABLE</span><b>6 CLASSES</b></div><div className="serene-product-class"><span>08:15</span><strong>Slow Flow<small>Maya Patel</small></strong><i><em style={{ width: "78%" }} /></i><b>4 spots</b></div><div className="serene-product-class"><span>12:30</span><strong>Core + Restore<small>Nia James</small></strong><i><em style={{ width: "58%" }} /></i><b>7 spots</b></div><div className="serene-product-class"><span>18:45</span><strong>Candlelight Yin<small>Orla Reed</small></strong><i><em className="waitlist" style={{ width: "96%" }} /></i><b className="waitlist-copy">Waitlist</b></div></div><div className="serene-member-pulse"><span>MEMBER PULSE</span><strong>Showing up</strong><div className="serene-pulse-ring"><b>78<span>%</span></b></div><small>attendance is holding across all classes</small></div></div></div></div></div><div className="serene-availability-ticket"><span>WAITLIST MOVING / 18:45</span><strong>Candlelight Yin</strong><small><i /> 1 spot just freed</small><b>Notify next member <ArrowRight size={13} /></b></div></div>
        </section>

        <section className="serene-marquee" aria-label="Studio operating principles"><div>Fill classes</div><span>✳</span><div>Move waitlists</div><span>✳</span><div>Keep members moving</div><span>✳</span><div>Fill classes</div></section>

        <section className="serene-section serene-rhythm" id="rhythm">
          <div className="serene-section-label">01 / The studio rhythm</div>
          <div className="serene-rhythm-grid"><div><h2>Your room.<br /><em>One clear view.</em></h2><p>From first booking to the final mat, Serene keeps the work visible without making your studio feel transactional. It is the operating layer behind the rituals your members come back for.</p><a className="serene-text-link" href="#timetable">Open the timetable <ArrowRight size={15} /></a></div><div className="serene-rhythm-points"><div><span>01</span><strong>Capacity stays honest</strong><p>See every spot, waitlist, and cancellation before the door opens.</p></div><div><span>02</span><strong>Teacher context on hand</strong><p>Keep member notes and regulars close to the class view.</p></div><div><span>03</span><strong>Follow-ups without chasing</strong><p>Let reminders and next steps happen in the background.</p></div></div></div>
        </section>

        <section className="serene-booking-section" id="timetable">
          <div className="serene-section-heading"><div><div className="serene-section-label">02 / Find your practice</div><h2>Choose the pace<br /><em>that meets you.</em></h2></div><p>Book in a few calm clicks. If a class fills, we will move you from waitlist to mat automatically when a space opens.</p></div>
          <div className="serene-booking-grid"><div className="serene-day-picker" role="tablist" aria-label="Choose a day">{Object.keys(timetable).map((day) => <button key={day} className={selectedDay === day ? "active" : ""} role="tab" aria-selected={selectedDay === day} onClick={() => setSelectedDay(day)}><span>{day === "Today" ? "Tue 14" : day}</span><small>{day === "Today" ? "Today" : day === "Wed 15" ? "Tomorrow" : "Thursday"}</small></button>)}</div><div className="serene-class-list">{classes.map((item) => <article className="serene-class-card" key={`${selectedDay}-${item.name}`}><div className={`serene-class-dot ${item.tone}`} /><div className="serene-class-time"><strong>{item.time}</strong><span>{item.duration}</span></div><div className="serene-class-content"><h3>{item.name}</h3><p>{item.teacher} · {item.level}</p></div><div className="serene-class-capacity"><span>{item.spots === 1 ? "Last spot" : `${item.spots} spots left`}</span><div className="serene-capacity-line"><i style={{ width: `${Math.max(18, 100 - item.spots * 8)}%` }} /></div></div><button className="serene-book-button" onClick={() => openBooking(item)}>Book <ArrowRight size={14} /></button></article>)}</div></div>
          <p className="serene-booking-note"><Clock3 size={14} /> Cancel up to 2 hours before class · Demo booking flow, no payment collected</p>
        </section>

        <section className="serene-section serene-owner-section" id="owners"><div className="serene-owner-image" role="img" aria-label="Yoga studio details and folded blanket"><div className="serene-owner-stamp">Built for<br />the people<br />behind the room</div></div><div className="serene-owner-copy"><div className="serene-section-label">03 / For studio owners</div><h2>One operating system for the whole <em>studio.</em></h2><p>Your guests feel the difference when the details are held. Serene Studio keeps your timetable, attendance, and member context together — without asking your team to become administrators first.</p><div className="serene-feature-list">{featureCards.map(({ icon: Icon, number, title, body }) => <div className="serene-feature" key={number}><span className="serene-feature-icon"><Icon size={17} /></span><div><span>{number}</span><strong>{title}</strong><p>{body}</p></div></div>)}</div><a className="serene-button dark" href="#timetable">See the owner view <ArrowRight size={16} /></a></div></section>

        <section className="serene-final-cta"><div className="serene-final-copy"><div className="serene-section-label">04 / Begin here</div><h2>Give your team a clearer room to <em>run.</em></h2><a className="serene-button saffron" href="#timetable">See Serene in action <ArrowRight size={16} /></a></div><div className="serene-final-mark"><img src="/manus-storage/serene-studio-mark_c9f820d2.png" alt="" /><span>serene studio<br /><small>your studio, in rhythm</small></span></div></section>
      </main>

      <footer className="serene-footer"><a className="serene-brand" href="#top"><img src="/manus-storage/serene-studio-mark_c9f820d2.png" alt="" /><span>serene<span>studio</span></span></a><span>East London · 06:30—21:00</span><span>© 2026 Serene Studio</span></footer>

      {bookingClass && <div className="serene-modal-backdrop" role="presentation" onClick={() => setBookingClass(null)}><section className="serene-booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={(event) => event.stopPropagation()}><button className="serene-modal-close" aria-label="Close booking" onClick={() => setBookingClass(null)}><X size={18} /></button>{confirmed ? <div className="serene-confirmation"><div className="serene-confirmation-icon"><Check size={22} /></div><div className="serene-section-label">Your mat is waiting</div><h2>See you for<br /><em>{bookingClass.name}.</em></h2><p>This is a demo booking confirmation for {bookingClass.time}. Connect your studio’s booking provider to make the reservation live.</p><button className="serene-button dark" onClick={() => setBookingClass(null)}>Back to timetable <ArrowRight size={15} /></button></div> : <><div className="serene-section-label">Book a class</div><h2 id="booking-title">{bookingClass.name}<br /><em>{bookingClass.time} · {selectedDay}</em></h2><p className="serene-modal-meta">With {bookingClass.teacher} · {bookingClass.duration} · {bookingClass.level}</p><form className="serene-booking-form" onSubmit={handleBooking}><label>First name<input required placeholder="Your first name" /></label><label>Email address<input required type="email" placeholder="you@example.com" /></label><label className="serene-checkbox"><input type="checkbox" required /><span />I agree to the studio’s booking policy</label><button className="serene-button primary" type="submit">Hold my spot <ArrowRight size={16} /></button><small>Demo booking flow · no payment collected</small></form></>}</section></div>}
    </div>
  );
}
