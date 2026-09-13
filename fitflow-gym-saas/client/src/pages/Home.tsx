/* Training Floor Utility: asymmetrical editorial layouts, chalk paper, ink green, Matcha Flash, clipped tickets, and fast tactile interactions. */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Dumbbell,
  Gift,
  Gauge,
  MapPin,
  Menu,
  MoveUpRight,
  QrCode,
  RefreshCw,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";

type FeatureKey = "checkin" | "bookings" | "workouts" | "growth";

const featureTabs: Array<{ id: FeatureKey; label: string; eyebrow: string; icon: typeof QrCode }> = [
  { id: "checkin", label: "Check-in", eyebrow: "Arrive without admin", icon: QrCode },
  { id: "bookings", label: "Bookings", eyebrow: "Protect every spot", icon: CalendarDays },
  { id: "workouts", label: "Workouts", eyebrow: "Coach with context", icon: Dumbbell },
  { id: "growth", label: "Member growth", eyebrow: "Keep the rhythm", icon: Trophy },
];

const classRows = [
  { name: "Power Yoga", coach: "Maya Patel", time: "18:30", capacity: 18, total: 20, status: "2 spots left", tone: "lime" },
  { name: "Strength Circuit", coach: "Tom Briggs", time: "19:15", capacity: 12, total: 16, status: "4 spots left", tone: "blue" },
  { name: "Reset + Stretch", coach: "Amina Cole", time: "20:00", capacity: 20, total: 20, status: "Waitlist open", tone: "coral" },
];

const featureCopy: Record<FeatureKey, { kicker: string; title: string; body: string; points: string[] }> = {
  checkin: {
    kicker: "Arrival, simplified",
    title: "A warmer welcome starts at the door.",
    body: "Members scan a QR code or opt into face recognition at the entrance. FitFlow marks attendance, updates streaks, and keeps your team out of the way of the first hello.",
    points: ["QR + optional face recognition", "Instant attendance records", "GDPR-minded consent prompts"],
  },
  bookings: {
    kicker: "Timetable, in motion",
    title: "Fill the room without the spreadsheet shuffle.",
    body: "Set capacity per class, let members self-serve, and auto-trigger a waitlist the moment a spot opens. Everyone sees the same live timetable — including your Google listing.",
    points: ["Live capacity limits", "Auto-waitlist on cancellation", "GMB-ready class availability"],
  },
  workouts: {
    kicker: "Coaching, with context",
    title: "Turn progress into a plan members can feel.",
    body: "FitFlow reads past performance, goals, and attendance to suggest the next sensible workout. Coaches stay in control; members get a reason to return tomorrow.",
    points: ["Goal-led recommendations", "Progress history in one view", "Coach approval before sharing"],
  },
  growth: {
    kicker: "Retention, made visible",
    title: "Make the next visit the easy choice.",
    body: "Reward attendance with points, spotlight member milestones, and collect UK direct debits with automatic retry flows when payments wobble.",
    points: ["Points for showing up", "Smoothies + merch rewards", "GoCardless-ready collections"],
  },
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("bookings");
  const [mobileNav, setMobileNav] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const activeCopy = featureCopy[activeFeature];
  const ActiveIcon = featureTabs.find((tab) => tab.id === activeFeature)?.icon ?? CalendarDays;

  const bookingFill = useMemo(() => classRows[0].capacity / classRows[0].total * 100, []);

  function handleTrialSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    toast.success("Trial request captured", { description: "In a live setup, this email would sync to your CRM." });
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-chalk text-ink">
      <header className="site-header">
        <div className="container flex items-center justify-between py-4">
          <a href="#top" className="brand-lockup" aria-label="FitFlow home">
            <img src="/manus-storage/fitflow-mark_3a06ef3b.png" alt="" className="brand-mark" />
            <span className="brand-name">fit<span>flow</span></span>
          </a>
          <nav className={`main-nav ${mobileNav ? "is-open" : ""}`} aria-label="Main navigation">
            <a href="#product" onClick={() => setMobileNav(false)}>Product</a>
            <a href="#why-fitflow" onClick={() => setMobileNav(false)}>Why FitFlow</a>
            <a href="#pricing" onClick={() => setMobileNav(false)}>Plans</a>
            <a href="#resources" onClick={() => setMobileNav(false)}>Resources</a>
            <Link href="/signin" className="mobile-signin-link" onClick={() => setMobileNav(false)}>Sign in</Link>
            <button className="nav-mobile-cta" onClick={() => { setTrialOpen(true); setMobileNav(false); }}>Book a trial <ArrowRight size={15} /></button>
          </nav>
          <div className="header-actions">
            <Link href="/signin" className="text-button hidden sm:inline-flex">Sign in</Link>
            <button className="button button-dark compact" onClick={() => setTrialOpen(true)}>Book a trial <ArrowRight size={15} /></button>
            <button className="mobile-menu" aria-label={mobileNav ? "Close menu" : "Open menu"} onClick={() => setMobileNav(!mobileNav)}>
              {mobileNav ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> FitFlow for UK studios</div>
              <h1>Run the floor.<br /><em>Grow the club.</em></h1>
              <p className="hero-lede">The calmer way to manage members, classes, coaching, and payments — built for the rhythm of independent gyms, yoga studios, and PT teams.</p>
              <div className="hero-benefits"><span><Check size={13} /> Fill more classes</span><span><Check size={13} /> Keep coaches in context</span><span><Check size={13} /> Collect without chasing</span></div>
              <div className="hero-actions">
                <button className="button button-lime" onClick={() => setTrialOpen(true)}>Book a trial class <ArrowRight size={17} /></button>
                <button className="text-link" onClick={() => scrollToId("product")}>See how it works <ChevronRight size={16} /></button>
              </div>
              <div className="hero-note"><ShieldCheck size={15} /> UK direct debit ready <span /> <MapPin size={15} /> Built for local studios</div>
            </div>

            <div className="hero-visual" aria-label="FitFlow product dashboard preview">
              <div className="visual-label visual-label-top">01 / studio control room</div>
              <div className="dashboard-window">
                <div className="window-topbar">
                  <div className="window-dots"><i /><i /><i /></div>
                  <div className="window-location"><span className="live-dot" /> Northline Studio <ChevronDown size={13} /></div>
                  <div className="window-avatar">AM</div>
                </div>
                <div className="dashboard-layout">
                  <aside className="dashboard-side">
                    <div className="side-mini-mark"><img src="/manus-storage/fitflow-mark_3a06ef3b.png" alt="" /></div>
                    <div className="side-nav-item active"><Gauge size={16} /> <span>Overview</span></div>
                    <div className="side-nav-item"><Users size={16} /> <span>Members</span></div>
                    <div className="side-nav-item"><CalendarDays size={16} /> <span>Timetable</span></div>
                    <div className="side-nav-item"><Dumbbell size={16} /> <span>Coaching</span></div>
                    <div className="side-nav-item"><CircleDollarSign size={16} /> <span>Payments</span></div>
                    <div className="side-spacer" />
                    <div className="side-nav-item"><Activity size={16} /> <span>Reports</span></div>
                  </aside>
                  <div className="dashboard-main">
                    <div className="dashboard-heading"><div><span className="utility-label">Tuesday / 14 May</span><h3>Good morning, Alex</h3></div><button className="icon-button"><RefreshCw size={15} /></button></div>
                    <div className="metric-grid">
                      <div className="metric-card"><span className="metric-icon lime"><Users size={14} /></span><span className="metric-label">Active members</span><strong>842</strong><small><span className="positive">+8.4%</span> this month</small></div>
                      <div className="metric-card"><span className="metric-icon blue"><CalendarDays size={14} /></span><span className="metric-label">Today’s visits</span><strong>126</strong><small><span className="positive">+12</span> vs Tuesday</small></div>
                      <div className="metric-card"><span className="metric-icon coral"><CircleDollarSign size={14} /></span><span className="metric-label">Collected</span><strong>£18.6k</strong><small><span className="positive">98.2%</span> on time</small></div>
                    </div>
                    <div className="dashboard-row">
                      <div className="panel-card timetable-card"><div className="panel-head"><div><span className="utility-label">Live timetable</span><h4>Tuesday, 14 May</h4></div><span className="mini-stamp">6 classes</span></div>{classRows.map((row) => <div className="class-row" key={row.name}><div className="class-time">{row.time}</div><div className="class-name"><strong>{row.name}</strong><span>{row.coach}</span></div><div className="capacity"><div className="capacity-bar"><span className={`fill ${row.tone}`} style={{ width: `${row.capacity / row.total * 100}%` }} /></div><small>{row.status}</small></div></div>)}</div>
                      <div className="panel-card pulse-card"><div className="panel-head"><div><span className="utility-label">Member pulse</span><h4>Showing up</h4></div><Sparkles size={17} className="pulse-spark" /></div><div className="ring-wrap"><div className="progress-ring"><span>76<span>%</span></span></div><div><strong>Strong week</strong><small>Attendance is up<br />across all classes.</small></div></div><div className="pulse-foot"><span className="positive">+14.2%</span><span>vs last week</span></div></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="availability-ticket"><div className="ticket-top"><span className="mini-stamp lime-stamp">GMB LIVE</span><span className="ticket-time">18:30 today</span></div><strong>Power Yoga</strong><div className="ticket-bottom"><span><span className="ticket-dot" /> 2 spots left</span><button onClick={() => setTrialOpen(true)}>Book a trial <ArrowRight size={13} /></button></div></div>
              <div className="hero-float-card"><div className="float-icon"><Trophy size={16} /></div><div><span className="utility-label">Member momentum</span><strong>+14.2%</strong><small>attendance this week</small></div><div className="float-sparkline"><i /><i /><i /><i /><i /></div></div>
              <div className="visual-label visual-label-bottom">A single view for the whole studio</div>
            </div>
          </div>
          <div className="hero-rule"><span>CLASS CAPACITY</span><i /><span>MEMBERSHIP HEALTH</span><i /><span>COACHING CONTEXT</span><i /><span>PAYMENTS, WITHOUT THE CHASE</span></div>
        </section>

        <section className="proof-strip" aria-label="FitFlow capabilities">
          <div className="container proof-grid">
            <div className="proof-intro"><span className="utility-label">The operator’s toolkit</span><strong>Built for the details<br />that keep the doors open.</strong></div>
            <div className="proof-item"><Zap size={18} /><div><strong>Less admin</strong><span>One place for the day</span></div></div>
            <div className="proof-item"><Target size={18} /><div><strong>More momentum</strong><span>Next visits, made visible</span></div></div>
            <div className="proof-item"><ShieldCheck size={18} /><div><strong>UK ready</strong><span>Direct debit + GMB</span></div></div>
          </div>
        </section>

        <section className="section-light product-section" id="product">
          <div className="container">
            <div className="section-kicker-row"><div className="eyebrow">01 / One calmer control room</div><span className="side-note">Tap a workflow to preview the product</span></div>
            <div className="section-intro split-intro"><div><h2>Everything moving<br /><em>in the same direction.</em></h2></div><p>FitFlow brings your timetable, member relationships, coach plans, rewards, and collections into a single operating rhythm — so your team can focus on the room.</p></div>
            <div className="feature-tabs" role="tablist" aria-label="FitFlow workflows">{featureTabs.map((tab) => { const Icon = tab.icon; const active = tab.id === activeFeature; return <button key={tab.id} className={`feature-tab ${active ? "active" : ""}`} onClick={() => setActiveFeature(tab.id)} role="tab" aria-selected={active}><span className="tab-number">0{featureTabs.indexOf(tab) + 1}</span><Icon size={18} /><span><strong>{tab.label}</strong><small>{tab.eyebrow}</small></span><ChevronRight size={16} className="tab-arrow" /></button>; })}</div>
            <div className="feature-showcase">
              <div className="feature-copy"><div className="feature-icon"><ActiveIcon size={19} /></div><span className="utility-label">{activeCopy.kicker}</span><h3>{activeCopy.title}</h3><p>{activeCopy.body}</p><ul>{activeCopy.points.map((point) => <li key={point}><span><Check size={13} /></span>{point}</li>)}</ul><button className="text-link" onClick={() => setTrialOpen(true)}>Explore this workflow <ArrowRight size={16} /></button></div>
              <div className={`feature-mock ${activeFeature}`}>
                {activeFeature === "bookings" && <><div className="mock-header"><div><span className="utility-label">Live class board</span><h4>Tuesday 14 May</h4></div><span className="mini-stamp lime-stamp">SYNCED TO GMB</span></div><div className="booking-summary"><div><span className="utility-label">Evening capacity</span><strong>86<span>%</span></strong><small><span className="positive">+11%</span> vs last week</small></div><div className="mini-chart"><i style={{ height: "34%" }} /><i style={{ height: "48%" }} /><i style={{ height: "42%" }} /><i style={{ height: "66%" }} /><i style={{ height: "54%" }} /><i className="today" style={{ height: `${bookingFill * 0.9}%` }} /><i style={{ height: "82%" }} /></div></div><div className="booking-list">{classRows.map((row) => <div className="booking-list-row" key={row.name}><div className={`booking-status ${row.tone}`} /><div className="booking-class"><strong>{row.name}</strong><span>{row.time} · {row.coach}</span></div><div className="booking-spots"><strong>{row.capacity}/{row.total}</strong><span>{row.status}</span></div><ChevronRight size={15} /></div>)}</div><div className="mock-ticket"><div><span className="mini-stamp coral-stamp">WAITLIST OPEN</span><strong>1 member ready to fill the next cancellation.</strong></div><Users size={17} /></div></>}
                {activeFeature === "checkin" && <><div className="mock-header"><div><span className="utility-label">Front desk / live</span><h4>Member arrival</h4></div><span className="mini-stamp lime-stamp">ONLINE</span></div><div className="checkin-panel"><div className="qr-card"><QrCode size={62} strokeWidth={1.3} /><span>Scan to enter</span><small>northline.fit/check-in</small></div><div className="checkin-divider"><span>or</span></div><div className="face-card"><div className="face-orbit"><ScanFace size={42} strokeWidth={1.3} /></div><strong>Face recognition</strong><span>Optional · consent led</span><button className="tiny-button">Preview flow <ArrowRight size={12} /></button></div></div><div className="checkin-log"><div className="log-head"><span className="utility-label">Today’s arrivals</span><span>126 visits</span></div>{["Ella Morgan", "Samir Khan", "Jo Davies"].map((name, index) => <div className="log-row" key={name}><div className="member-initials">{name.split(" ").map((part) => part[0]).join("")}</div><div><strong>{name}</strong><span>{index === 0 ? "Just now" : `${index + 2} min ago`} · {index === 0 ? "Power Yoga" : "Open Gym"}</span></div><Check size={14} className="log-check" /></div>)}</div></>}
                {activeFeature === "workouts" && <><div className="mock-header"><div><span className="utility-label">Coach view / member</span><h4>Leah Okafor</h4></div><span className="mini-stamp blue-stamp">AI SUGGESTION</span></div><div className="workout-profile"><div className="profile-avatar">LO</div><div><strong>Build strength + feel good</strong><span>Goal set 12 weeks ago · 4 sessions this month</span></div><div className="profile-score"><span>Consistency</span><strong>82</strong></div></div><div className="workout-suggestion"><div className="suggestion-top"><span className="feature-icon small"><Bot size={15} /></span><div><span className="utility-label">FitFlow suggestion</span><strong>Thursday · Lower body + core</strong></div><span className="suggestion-match">94% match</span></div><div className="exercise-pills"><span>Goblet squat <b>3 × 10</b></span><span>Dead bug <b>3 × 12</b></span><span>Carry <b>4 × 30m</b></span></div><div className="suggestion-footer"><span><Clock3 size={13} /> 42 min · Moderate</span><button className="tiny-button">Review plan <ArrowRight size={12} /></button></div></div><div className="progress-line"><span>12-week progress</span><strong>Week 8 of 12</strong><div><i style={{ width: "67%" }} /></div></div></>}
                {activeFeature === "growth" && <><div className="mock-header"><div><span className="utility-label">Member momentum</span><h4>Small wins, seen often</h4></div><span className="mini-stamp coral-stamp">THIS MONTH</span></div><div className="growth-grid"><div className="growth-stat"><Gift size={17} /><strong>2,480</strong><span>points earned</span><small>+18% this month</small></div><div className="growth-stat"><Trophy size={17} /><strong>#04</strong><span>member leaderboard</span><small>Leah moved up 3</small></div><div className="growth-stat"><CreditCard size={17} /><strong>98.2%</strong><span>collected on time</span><small>GoCardless retries on</small></div></div><div className="leaderboard"><div className="log-head"><span className="utility-label">Top of the board</span><span>Redeemable rewards</span></div>{[["JK", "Jasmine Khan", "680 pts", "Smoothie"], ["LO", "Leah Okafor", "620 pts", "Merch £10"], ["AB", "Alex Brown", "540 pts", "Class credit"]].map(([initials, name, points, reward], index) => <div className="leader-row" key={name}><span className="rank">0{index + 1}</span><span className="member-initials">{initials}</span><div><strong>{name}</strong><span>{points}</span></div><span className="reward-chip">{reward}</span></div>)}</div></>}
              </div>
            </div>
          </div>
        </section>

        <section className="ink-section" id="why-fitflow">
          <div className="container story-grid">
            <div className="story-copy"><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Designed for the whole shift</div><h2>The front desk, the coach, and the owner — finally on the same page.</h2><p>FitFlow is less about adding software and more about removing the little gaps between a member’s intention and their next visit.</p><div className="story-metrics"><div><strong>01</strong><span>Scan or smile<br />at the door</span></div><div><strong>02</strong><span>Book without<br />the back-and-forth</span></div><div><strong>03</strong><span>Pay, progress,<br />repeat</span></div></div><button className="button button-lime" onClick={() => scrollToId("demo")}>Take the product tour <ArrowRight size={16} /></button></div>
            <div className="story-images"><div className="image-note">THE MEMBERSHIP<br />MOMENT, MADE<br />VISIBLE <MoveUpRight size={18} /></div><img className="story-image-main" src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1100&q=85" alt="Bright independent gym floor with equipment and training zones" /><img className="story-image-small" src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=700&q=85" alt="Coach guiding a member through a focused training session" /><div className="story-stamp">UK<br />READY</div></div>
          </div>
        </section>

        <section className="section-light demo-section" id="demo">
          <div className="container demo-grid"><div className="demo-heading"><div className="eyebrow">02 / Built to be used</div><h2>A demo that feels like<br /><em>Tuesday at 6:30.</em></h2><p>Switch between operator moments to see how FitFlow turns busy studio patterns into clear next actions.</p><div className="demo-steps"><div className="demo-step active"><span>01</span><div><strong>Protect capacity</strong><small>Class booking + waitlist</small></div></div><div className="demo-step"><span>02</span><div><strong>Guide the next workout</strong><small>Member context + AI</small></div></div><div className="demo-step"><span>03</span><div><strong>Keep payments moving</strong><small>Direct debit + retries</small></div></div></div></div><div className="demo-card"><div className="demo-card-top"><span className="mini-stamp lime-stamp">LIVE DEMO</span><span className="utility-label">Northline Studio / operator view</span><span className="demo-card-date">Tue 14 May</span></div><div className="demo-big-number"><span className="utility-label">Places filled today</span><strong>126 <small>/ 148</small></strong><div className="big-progress"><span style={{ width: "85%" }} /></div><div className="demo-big-foot"><span>85% of capacity</span><span className="positive">+12 vs last Tuesday</span></div></div><div className="demo-alert"><span className="alert-icon"><RefreshCw size={15} /></span><div><strong>A space just opened in Power Yoga.</strong><span>Waitlist member Priya S. notified automatically.</span></div><ChevronRight size={17} /></div><div className="demo-list"><div><span className="list-icon lime"><QrCode size={15} /></span><strong>Check-in scan complete</strong><span>Ella Morgan · just now</span></div><div><span className="list-icon blue"><Bot size={15} /></span><strong>Workout suggestion ready</strong><span>Leah Okafor · coach review</span></div><div><span className="list-icon coral"><CreditCard size={15} /></span><strong>Payment retry scheduled</strong><span>2 members · tomorrow 09:00</span></div></div><div className="demo-card-foot"><span><ShieldCheck size={14} /> No spreadsheets were harmed.</span><button onClick={() => setTrialOpen(true)}>Open your studio view <ArrowRight size={14} /></button></div></div></div>
        </section>

        <section className="pricing-section" id="pricing"><div className="container pricing-grid"><div className="pricing-copy"><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Simple monthly pricing</div><h2>One plan for<br /><em>the way you work.</em></h2><p>Start with the workflows that matter now. Add locations and coaches as your floor gets busier.</p><div className="pricing-annotation"><span>NO CONTRACT<br />MONTHLY BILLING</span><ArrowRight size={17} /></div></div><div className="pricing-card"><div className="pricing-card-head"><span className="mini-stamp lime-stamp">STUDIO PLAN</span><span className="utility-label">For independent teams</span></div><div className="price"><span>from</span><strong>£59</strong><small>/ location / month</small></div><div className="price-rule" /><ul><li><Check size={14} /> Memberships + attendance</li><li><Check size={14} /> Live timetable + waitlist</li><li><Check size={14} /> QR check-in + optional face recognition</li><li><Check size={14} /> Workouts, rewards + leaderboards</li><li><Check size={14} /> GoCardless collection flows</li></ul><button className="button button-lime full" onClick={() => setTrialOpen(true)}>Book a trial class <ArrowRight size={16} /></button><span className="pricing-footnote">Your first studio walkthrough is on us.</span></div></div></section>

        <section className="faq-section" id="resources"><div className="container faq-grid"><div><div className="eyebrow">03 / Good to know</div><h2>Answers before<br /><em>the first class.</em></h2><p className="faq-intro">FitFlow is designed to make the operational shift feel lighter — without asking your members to learn a new way of being a member.</p><button className="text-link" onClick={() => toast("Resources coming soon", { description: "The next release will include a setup guide and GMB checklist." })}>Browse setup resources <ArrowRight size={16} /></button></div><div className="faq-list"><details open><summary>Can FitFlow show class availability on Google? <ChevronDown size={18} /></summary><p>Yes. FitFlow is designed to publish a structured availability layer alongside your Google Business Profile and connect trial intent back to your CRM.</p></details><details><summary>Does it support UK direct debits? <ChevronDown size={18} /></summary><p>The product story is built around GoCardless-ready collections, retries, and clear payment status. A live connection would be configured during onboarding.</p></details><details><summary>Can coaches approve AI workout suggestions? <ChevronDown size={18} /></summary><p>Yes. Suggestions are surfaced for coach review before they become a member-facing plan, keeping professional judgement in the loop.</p></details><details><summary>Is face recognition required for check-in? <ChevronDown size={18} /></summary><p>No. QR is the default flow. Face recognition is positioned as an optional, consent-led layer for studios that want faster repeat visits.</p></details></div></div></section>

        <section className="closing-cta"><div className="container closing-inner"><div><span className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Make the next visit easier</span><h2>More room for the work<br /><em>that makes a studio.</em></h2></div><div className="closing-action"><p>See FitFlow in your own timetable, with your own member rhythm.</p><button className="button button-lime" onClick={() => setTrialOpen(true)}>Book a trial class <ArrowRight size={17} /></button></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><a href="#top" className="brand-lockup"><img src="/manus-storage/fitflow-mark_3a06ef3b.png" alt="" className="brand-mark" /><span className="brand-name">fit<span>flow</span></span></a><p>Studio management with a little more rhythm.</p><span className="footer-small">Made for UK gyms, yoga studios, and PT teams.</span></div><div className="footer-links"><div><span className="footer-label">Product</span><a href="#product">Workflows</a><a href="#demo">Product tour</a><a href="#pricing">Plans</a></div><div><span className="footer-label">Company</span><a href="#why-fitflow">Why FitFlow</a><a href="#resources">Resources</a><button onClick={() => toast("Contact form coming soon")}>Contact</button></div><div><span className="footer-label">Legal</span><button onClick={() => toast("Privacy page coming soon")}>Privacy</button><button onClick={() => toast("Terms page coming soon")}>Terms</button><span className="footer-status"><span /> Systems normal</span></div></div></div><div className="container footer-bottom"><span>© 2026 FitFlow Ltd.</span><span>London · Manchester · Wherever your members train</span><span>Built for the next visit.</span></div></footer>

      {trialOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setTrialOpen(false); }}><div className="trial-modal" role="dialog" aria-modal="true" aria-labelledby="trial-title"><button className="modal-close" aria-label="Close trial form" onClick={() => setTrialOpen(false)}><X size={18} /></button>{submitted ? <div className="submitted-state"><div className="submitted-icon"><Check size={26} /></div><span className="eyebrow">You’re on the list</span><h2>We’ll meet you<br /><em>on the floor.</em></h2><p>Thanks — your trial request is captured. In a live FitFlow setup, this would sync to the gym’s CRM and send the next step to your inbox.</p><button className="button button-dark full" onClick={() => { setSubmitted(false); setTrialOpen(false); }}>Back to FitFlow <ArrowRight size={16} /></button></div> : <><div className="modal-mark"><img src="/manus-storage/fitflow-mark_3a06ef3b.png" alt="" /></div><span className="eyebrow">Book a trial class</span><h2 id="trial-title">See what your<br /><em>Tuesday could feel like.</em></h2><p>Leave your email and we’ll send a short studio walkthrough. No hard sell, just the useful bits.</p><form onSubmit={handleTrialSubmit}><label htmlFor="trial-email">Work email</label><input id="trial-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@yourstudio.co.uk" required /><button className="button button-lime full" type="submit">Send me the walkthrough <ArrowRight size={16} /></button></form><small className="modal-note"><ShieldCheck size={13} /> Your email stays with your studio conversation.</small></>}</div></div>}
    </div>
  );
}
