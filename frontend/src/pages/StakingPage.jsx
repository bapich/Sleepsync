import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  configuredNetworkPassphrase,
  configuredRewardContractId,
  hasContractConfig,
  parseError,
  readStakingDashboard,
  stakeTokens,
  unstakeTokens,
  shortAddress,
} from "../lib/sleepSync";
import { sharedWallet, walletListeners } from "../components/Navbar";

const emptyTx = { status: "idle", message: "", hash: "" };

export default function StakingPage() {
  const [wallet, setWallet] = useState(sharedWallet);
  const [txState, setTxState] = useState(emptyTx);
  const [stakeAmt, setStakeAmt] = useState("100");
  const [unstakeAmt, setUnstakeAmt] = useState("100");

  useEffect(() => {
    const l = (w) => setWallet(w);
    walletListeners.add(l);
    return () => walletListeners.delete(l);
  }, []);

  const ready = Boolean(wallet.account) && Boolean(configuredRewardContractId);

  const stakingQ = useQuery({
    queryKey: ["staking", wallet.account],
    queryFn: () => readStakingDashboard(wallet.account),
    enabled: ready,
    staleTime: 10_000,
    refetchInterval: 20_000,
  });

  const stakingData = stakingQ.data || { balance: 0, staked: 0 };
  const multiplier = 1 + Math.floor(stakingData.staked / 1000);

  async function runTx(fn, pending, success) {
    setTxState({ status: "pending", message: pending, hash: "" });
    try {
      const result = await fn();
      setTxState({ status: "success", message: success, hash: result?.hash || "" });
      stakingQ.refetch();
    } catch (err) {
      setTxState({ status: "error", message: parseError(err), hash: "" });
    }
  }

  const stakeMutation = useMutation({
    mutationFn: () => runTx(
      () => stakeTokens(wallet.account, stakeAmt),
      "Staking SLEEP tokens…",
      "SLEEP tokens staked successfully! "
    )
  });

  const unstakeMutation = useMutation({
    mutationFn: () => runTx(
      () => unstakeTokens(wallet.account, unstakeAmt),
      "Unstaking SLEEP tokens…",
      "SLEEP tokens unstaked successfully!"
    )
  });

  const anyPending = stakeMutation.isPending || unstakeMutation.isPending;

  return (
    <main className="staking-page animate-in" id="main-content" tabIndex={-1}>
      <div className="container">
        <header className="page-header">
          <h1 className="page-title">SLEEP Staking Pool</h1>
          <p className="page-subtitle">Stake tokens to earn compounding reward multipliers</p>
        </header>

        {/* Status */}
        {txState.message && (
          <div className={`status-toast ${txState.status}`} role={txState.status === "error" ? "alert" : "status"} aria-live="polite">
            <span className="status-dot" aria-hidden="true" />
            <span>{txState.message}</span>
          </div>
        )}

        {!configuredRewardContractId && (
          <div className="status-toast error">
            <span className="status-dot" aria-hidden="true" />
            VITE_REWARD_CONTRACT_ID not configured. Deploy the sleep_reward contract first.
          </div>
        )}

        {/* Hero Stats Card */}
        <div className="staking-hero-card">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            <div style={{ textAlign: "center" }}>
              <div className="stat-label" style={{ marginBottom: "0.5rem" }}>Available Balance</div>
              <div className="stat-value" style={{ fontSize: "2.5rem", background: "linear-gradient(135deg, #818CF8, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {stakingData.balance.toLocaleString()}
              </div>
              <div className="stat-note">SLEEP tokens</div>
            </div>
            <div style={{ textAlign: "center", borderLeft: "1px solid var(--color-border)", borderRight: "1px solid var(--color-border)" }}>
              <div className="stat-label" style={{ marginBottom: "0.5rem" }}>Currently Staked</div>
              <div className="stat-value" style={{ fontSize: "2.5rem", color: "var(--color-purple)" }}>
                {stakingData.staked.toLocaleString()}
              </div>
              <div className="stat-note">SLEEP staked</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="stat-label" style={{ marginBottom: "0.5rem" }}>Reward Multiplier</div>
              <div className="stat-value" style={{ fontSize: "2.5rem", color: "var(--color-emerald)" }}>
                {multiplier}×
              </div>
              <div className="stat-note">Current boost</div>
            </div>
          </div>
        </div>

        <div className="staking-grid">
          {/* Stake */}
          <div className="panel">
            <div className="panel-head">
              <div className="section-eyebrow">Deposit</div>
              <h2 className="panel-title">Stake SLEEP Tokens</h2>
              <p className="panel-subtitle">Lock tokens to boost your rewards</p>
            </div>

            <div className="form-group mb-3">
              <label className="form-label" htmlFor="stake-amount">Amount to Stake</label>
              <input
                id="stake-amount"
                type="number"
                className="form-input"
                min="1"
                step="1"
                value={stakeAmt}
                onChange={(e) => setStakeAmt(e.target.value)}
              />
              <span className="text-faint" style={{ fontSize: "0.78rem" }}>
                Available: {stakingData.balance.toLocaleString()} SLEEP
              </span>
            </div>

            {/* Multiplier preview */}
            <div style={{ padding: "1rem", background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.2)", borderRadius: "var(--radius-md)", marginBottom: "1.25rem" }}>
              <div className="flex items-center justify-between">
                <span className="text-muted" style={{ fontSize: "0.875rem" }}>After staking {stakeAmt} SLEEP:</span>
                <span className="text-primary fw-700" style={{ fontFamily: "var(--font-mono)" }}>
                  {1 + Math.floor((stakingData.staked + Number(stakeAmt || 0)) / 1000)}× multiplier
                </span>
              </div>
            </div>

            <button
              id="stake-btn"
              className="btn btn-primary w-full"
              onClick={() => stakeMutation.mutate()}
              disabled={anyPending || !wallet.account || !configuredRewardContractId}
              aria-busy={stakeMutation.isPending}
              style={{ minHeight: "48px" }}
            >
              {stakeMutation.isPending ? "Staking…" : "Stake SLEEP ⬡"}
            </button>
          </div>

          {/* Unstake */}
          <div className="panel">
            <div className="panel-head">
              <div className="section-eyebrow">Withdraw</div>
              <h2 className="panel-title">Unstake SLEEP Tokens</h2>
              <p className="panel-subtitle">Withdraw staked tokens back to your balance</p>
            </div>

            <div className="form-group mb-3">
              <label className="form-label" htmlFor="unstake-amount">Amount to Unstake</label>
              <input
                id="unstake-amount"
                type="number"
                className="form-input"
                min="1"
                step="1"
                value={unstakeAmt}
                onChange={(e) => setUnstakeAmt(e.target.value)}
              />
              <span className="text-faint" style={{ fontSize: "0.78rem" }}>
                Staked: {stakingData.staked.toLocaleString()} SLEEP
              </span>
            </div>

            <div style={{ padding: "1rem", background: "rgba(244,114,182,0.06)", border: "1px solid rgba(244,114,182,0.2)", borderRadius: "var(--radius-md)", marginBottom: "1.25rem" }}>
              <div className="flex items-center justify-between">
                <span className="text-muted" style={{ fontSize: "0.875rem" }}>Multiplier after unstake:</span>
                <span style={{ color: "var(--color-pink)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                  {1 + Math.floor(Math.max(0, stakingData.staked - Number(unstakeAmt || 0)) / 1000)}×
                </span>
              </div>
            </div>

            <button
              id="unstake-btn"
              className="btn btn-outline w-full"
              onClick={() => unstakeMutation.mutate()}
              disabled={anyPending || !wallet.account || !configuredRewardContractId}
              aria-busy={unstakeMutation.isPending}
              style={{ minHeight: "48px" }}
            >
              {unstakeMutation.isPending ? "Unstaking…" : "Unstake SLEEP "}
            </button>
          </div>
        </div>

        {/* How staking works */}
        <div className="panel" style={{ marginTop: "1.5rem" }}>
          <div className="panel-head">
            <div className="section-eyebrow">Learn</div>
            <h2 className="panel-title">How Staking Works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {[
              { icon: "", title: "Earn SLEEP", desc: "Hit your weekly sleep goal to automatically mint SLEEP tokens via cross-contract calls." },
              { icon: "⬡", title: "Stake & Multiply", desc: "Every 1,000 SLEEP staked adds a 1× multiplier to your future minting rewards." },
              { icon: "", title: "Compound Growth", desc: "More you stake, bigger the multiplier. With 5,000 staked, earn 6× on every reward mint!" },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }} aria-hidden="true">{icon}</div>
                <h3 className="panel-title" style={{ marginBottom: "0.5rem" }}>{title}</h3>
                <p className="text-muted" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
