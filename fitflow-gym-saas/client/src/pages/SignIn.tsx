/* Training Floor Utility: the sign-in page pairs a deep ink operator panel with a chalk-paper form, using Matcha Flash for status and action. */
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Eye, EyeOff, LockKeyhole, Mail, QrCode, ShieldCheck, Sparkles, Users } from "lucide-react";

export default function SignIn() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) return;
    setSubmitted(true);
    toast.success("Demo sign-in captured", { description: "Connect your authentication provider here for production access." });
    window.setTimeout(() => navigate("/"), 550);
  }

  return (
    <div className="signin-page">
      <section className="signin-visual" aria-label="FitFlow product overview">
        <div className="signin-visual-orbit signin-orbit-one" />
        <div className="signin-visual-orbit signin-orbit-two" />
        <div className="signin-visual-top">
          <Link href="/" className="brand-lockup signin-brand"><span className="signin-logo-mark">F</span><span className="brand-name">fit<span>flow</span></span></Link>
          <span className="signin-operator-tag"><span /> Operator access</span>
        </div>
        <div className="signin-visual-copy">
          <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Your studio, in step</div>
          <h1>Keep the room<br /><em>moving forward.</em></h1>
          <p>Pick up the day where you left it: live capacity, member momentum, coaching context, and payments that keep pace.</p>
          <div className="signin-proof-grid">
            <div><strong>01</strong><span>See who’s<br />showing up</span></div>
            <div><strong>02</strong><span>Spot the next<br />best action</span></div>
            <div><strong>03</strong><span>Leave admin<br />at the door</span></div>
          </div>
        </div>
        <div className="signin-mini-panel">
          <div className="signin-mini-head"><span className="mini-stamp lime-stamp">NORTHLINE / LIVE</span><span className="utility-label">Tuesday / 14 May</span></div>
          <div className="signin-mini-stats"><div><span className="signin-mini-icon lime"><Users size={14} /></span><strong>842</strong><small>active members</small></div><div><span className="signin-mini-icon blue"><CalendarDays size={14} /></span><strong>126</strong><small>visits today</small></div><div><span className="signin-mini-icon coral"><QrCode size={14} /></span><strong>18:30</strong><small>next class</small></div></div>
          <div className="signin-mini-footer"><span><span className="signin-live-dot" /> All systems normal</span><Sparkles size={14} /></div>
        </div>
      </section>

      <section className="signin-form-side">
        <div className="signin-form-top"><Link href="/" className="back-link"><ArrowLeft size={15} /> Back to FitFlow</Link><span className="signin-help">Need a hand? <button onClick={() => toast("Support is coming soon", { description: "For now, use the trial form on the home page." })}>Contact support</button></span></div>
        <div className="signin-form-wrap">
          <div className="signin-card"><div className="signin-product-label"><span className="signin-product-mark">F</span><span>fit<span>flow</span><em>studio operating system</em></span></div><div className="signin-card-mark"><LockKeyhole size={18} /></div><div className="eyebrow">Studio operator login</div><h2>Good to see you<br /><em>again.</em></h2><p className="signin-form-lede">Sign in to pick up your studio’s rhythm.</p><form onSubmit={handleSubmit}><div className="field-group"><label htmlFor="signin-email">Work email</label><div className="input-wrap"><Mail size={16} /><input id="signin-email" type="email" autoComplete="email" placeholder="you@yourstudio.co.uk" value={email} onChange={(event) => setEmail(event.target.value)} required /></div></div><div className="field-group"><div className="field-label-row"><label htmlFor="signin-password">Password</label><button type="button" onClick={() => toast("Password reset coming soon", { description: "A live auth connection will power this flow." })}>Forgot password?</button></div><div className="input-wrap"><LockKeyhole size={16} /><input id="signin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button className="password-toggle" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div><label className="remember-row"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span className="fake-checkbox"><Check size={11} /></span><span>Keep me signed in on this device</span></label><button className="button button-lime full signin-submit" type="submit">Sign in to FitFlow <ArrowRight size={16} /></button></form><div className="signin-security"><ShieldCheck size={14} /><span>Secure studio access · UK-ready workflows</span></div></div>
        </div>
        <div className="signin-form-footer"><span>© 2026 FitFlow Ltd.</span><span>Private by design.</span></div>
      </section>
    </div>
  );
}
