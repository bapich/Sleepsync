import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connectWallet } from "../lib/sleepSync";
import { sharedWallet, notifyWalletChange, walletListeners } from "../components/Navbar";

export default function LandingPage() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(sharedWallet);

  useEffect(() => {
    const listener = (next) => setWallet(next);
    walletListeners.add(listener);
    return () => walletListeners.delete(listener);
  }, []);

  async function handleConnect() {
    try {
      const updated = await connectWallet();
      notifyWalletChange(updated);
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
    }
  }

  const features = [
    {
      icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      iconClass: "fi-indigo",
      title: "On-Chain Sleep Logging",
      desc: "Every sleep session is immutably recorded on Stellar's Soroban blockchain. Your data belongs to you — always."
    },
    {
      icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      iconClass: "fi-sky",
      title: "Smart Recovery Score",
      desc: "Our algorithm tracks consistency, bedtime adherence, and session frequency to calculate your true sleep recovery."
    },
    {
      icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      iconClass: "fi-purple",
      title: "Global Leaderboard",
      desc: "Compete with sleepers worldwide. Top performers earn SLEEP tokens and climb the on-chain rankings."
    },
    {
      icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      iconClass: "fi-green",
      title: "SLEEP Token Rewards",
      desc: "Hit your weekly goals and earn SLEEP tokens. Stake them for compound multipliers on future rewards."
    },
    {
      icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
      iconClass: "fi-amber",
      title: "Staking Pool",
      desc: "Lock your SLEEP tokens in the staking pool. The more you stake, the higher your reward multiplier."
    },
    {
      icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      iconClass: "fi-pink",
      title: "Multi-Wallet Support",
      desc: "Works with Freighter, xBull, Lobstr, and any Stellar Wallets Kit compatible wallet."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Connect Your Wallet",
      desc: "Connect any Stellar-compatible wallet in one click. We support Freighter, xBull, Lobstr and more."
    },
    {
      num: "02",
      title: "Log Your Sleep",
      desc: "Record each session — type, duration, and bedtime adherence. Data is stored on Soroban forever."
    },
    {
      num: "03",
      title: "Earn & Stake Rewards",
      desc: "Hit your weekly goals to mint SLEEP tokens. Stake them for multiplied future rewards."
    }
  ];

  return (
    <div className="landing">
      {/* Top Header */}
      <header style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "1.5rem", display: "flex", justifyContent: "flex-end", zIndex: 100 }}>
        {wallet.account ? (
          <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleConnect}>
            Connect Wallet
          </button>
        )}
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="container">

          <h1 className="hero-heading">
            Sleep Better,<br />
            <span>Earn On-Chain</span>
          </h1>

          <p className="hero-sub">
            SleepSync is the first blockchain-powered sleep tracker. Log every session on Soroban, earn SLEEP tokens for hitting your goals, and stake them for compound rewards.
          </p>

          <div className="hero-cta">
            <button
              id="landing-launch-btn"
              className="btn btn-primary btn-xl"
              onClick={() => navigate("/dashboard")}
            >
               Launch App
            </button>
            <button
              id="landing-learn-btn"
              className="btn btn-ghost btn-xl"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              How it works
            </button>
          </div>

          {/* Browser Preview */}
          <div className="hero-img-wrap">
            <div className="hero-img-glow" aria-hidden="true" />
            <div className="hero-preview">
              <div className="hero-preview-bar">
                <span className="dot dot-red" aria-hidden="true" />
                <span className="dot dot-amber" aria-hidden="true" />
                <span className="dot dot-green" aria-hidden="true" />
                <span className="preview-url">sleepsync.stellar.app/dashboard</span>
              </div>
              <div className="preview-inner">
                {[
                  { val: "7h 23m", lbl: "Avg Sleep" },
                  { val: "84%", lbl: "Recovery" },
                  { val: "2,400", lbl: "SLEEP Tokens" }
                ].map(({ val, lbl }) => (
                  <div className="preview-stat" key={lbl}>
                    <div className="preview-stat-val">{val}</div>
                    <div className="preview-stat-lbl">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip">
        <div className="container">
          <div className="stats-strip-grid">
            {[
              { val: "10,000+", lbl: "Sessions Logged" },
              { val: "$0", lbl: "Data Sold" },
              { val: "500+", lbl: "Active Sleepers" },
              { val: "∞", lbl: "Chain Uptime" }
            ].map(({ val, lbl }) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div className="strip-value">{val}</div>
                <div className="strip-label">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="features-header">
            <div className="section-eyebrow" style={{ justifyContent: "center" }}>Features</div>
            <h2 className="section-title" style={{ fontSize: "2rem", textAlign: "center" }}>
              Everything you need to optimize your sleep
            </h2>
            <p className="section-body" style={{ textAlign: "center", maxWidth: "500px", margin: "0.5rem auto 0" }}>
              From bedtime tracking to token rewards, SleepSync brings DeFi mechanics to your wellness journey.
            </p>
          </div>

          <div className="features-grid">
            {features.map(({ icon, iconClass, title, desc }) => (
              <div className="feature-card" key={title}>
                <div className={`feature-icon ${iconClass}`} aria-hidden="true">{icon}</div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="features-header" style={{ marginBottom: "3rem" }}>
            <div className="section-eyebrow" style={{ justifyContent: "center" }}>How it Works</div>
            <h2 className="section-title" style={{ fontSize: "2rem", textAlign: "center" }}>
              Three steps to better sleep
            </h2>
          </div>

          <div className="how-steps">
            {steps.map(({ num, title, desc }) => (
              <div className="how-step" key={num}>
                <div className="step-number" aria-hidden="true">{num}</div>
                <h3 className="step-title">{title}</h3>
                <p className="step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2 className="cta-title">Ready to start your sleep journey?</h2>
            <p className="cta-sub">
              Connect your wallet and log your first session in under a minute. Your sleep data, secured forever on Stellar.
            </p>
            <button
              id="cta-launch-btn"
              className="btn btn-primary btn-xl"
              onClick={() => navigate("/dashboard")}
            >
              Get Started Free 
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <p className="footer-text">© 2025 SleepSync · Built on Stellar Soroban</p>
            <div className="footer-links">
              <a href="https://stellar.org" target="_blank" rel="noreferrer">Stellar</a>
              <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noreferrer">Explorer</a>
              <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
