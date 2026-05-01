import { useState, useEffect, useCallback, useRef } from "react";
import Style from "./OnboardingModal.module.css";

// ─── Step Definitions ──────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    key: "metamask",
    icon: "🦊",
    title: "Install MetaMask",
    subtitle: "Your gateway to Web3",
    description:
      "MetaMask is a browser wallet that lets you interact with the blockchain. Install it, then create and log in to your account before continuing.",
    action: "Open MetaMask Website",
    hint: "After installing and logging in, come back and click Continue.",
  },
  {
    id: 2,
    key: "rpc",
    icon: "🔑",
    title: "Get Alchemy RPC URL",
    subtitle: "Your personal blockchain endpoint",
    description:
      "• Login with Google or Email\n• Fill the form — Name: blockchain-chat-app | Description: Sepolia testnet for chat app | Use case: NFTs or Wallet\n• Change Network → Select Ethereum Sepolia\n• Click Create App\n• Copy the Endpoint HTTPS URL → Paste below",
    action: null,
    hint: "URL looks like: https://eth-sepolia.g.alchemy.com/v2/YourKey",
  },
  {
    id: 3,
    key: "network",
    icon: "🌐",
    title: "Add Sepolia Network",
    subtitle: "Connect to the test network",
    description:
      "Open MetaMask Networks → Search 'Sepolia' → Edit with these values:\n• Network name: Sepolia\n• Default RPC URL: (your Alchemy URL from step 2)\n• Chain ID: 11155111\n• Currency symbol: SepoliaETH\n• Block explorer URL: https://sepolia.drpc.org",
    action: null,
    hint: "Approve the network in the MetaMask popup that just appeared.",
  },
  {
    id: 4,
    key: "faucet",
    icon: "⛽",
    title: "Get Free Test ETH",
    subtitle: "Fuel for your transactions",
    description:
      "You need Sepolia ETH to pay gas fees. Open the Google Web3 faucet, select Ethereum Sepolia, paste your wallet address, and request free ETH.",
    action: "Open Google Faucet",
    hint: "Paste your wallet address and click 'Get 0.05 Sepolia ETH'. Come back once received.",
  },
  {
    id: 5,
    key: "connect",
    icon: "🔗",
    title: "Connect Your Wallet",
    subtitle: "Prove you're you",
    description: "Click below to connect your MetaMask wallet to this application.",
    action: "Connect Wallet",
    hint: "A MetaMask popup will appear — approve it.",
  },
  {
    id: 6,
    key: "switch",
    icon: "🔄",
    title: "Switch to Sepolia",
    subtitle: "Activate the test network",
    description:
      "This app runs on Sepolia. Switch your active network so you can interact with the smart contract.",
    action: "Switch to Sepolia",
    hint: "MetaMask will ask you to confirm the switch.",
  },
  {
    id: 7,
    key: "account",
    icon: "✨",
    title: "Create Your Account",
    subtitle: "Join the conversation",
    description: "Almost there! Register your username on-chain to start chatting.",
    action: null,
    hint: "This will trigger a small gas fee on Sepolia.",
  },
];

const SEPOLIA_CHAIN_ID = "0xaa36a7";

// ─── MetaMask RPC Popup ────────────────────────────────────────────────────────
function MetaMaskRpcPopup({ url, status, onRetry, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const iconColor =
    status === "success" ? "#6FCF97" : status === "error" ? "#EB5757" : "#E2761B";
  const iconBg =
    status === "success"
      ? "rgba(111,207,151,0.12)"
      : status === "error"
      ? "rgba(235,87,87,0.12)"
      : "rgba(226,118,27,0.12)";
  const iconBorder =
    status === "success"
      ? "rgba(111,207,151,0.3)"
      : status === "error"
      ? "rgba(235,87,87,0.3)"
      : "rgba(226,118,27,0.25)";

  return (
    <div style={popupStyles.backdrop}>
      <div style={popupStyles.popup}>
        {/* Header */}
        <div style={popupStyles.header}>
          <div style={popupStyles.headerLeft}>
            <svg width="26" height="26" viewBox="0 0 318.6 318.6" fill="none">
              <polygon fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" points="274.1,35.5 174.6,109.4 193,65.8" />
              <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="44.4,35.5 143.1,110.1 125.6,65.8" />
              <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="238.3,206.8 211.8,247.4 268.5,263 284.8,207.7" />
              <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="33.9,207.7 50.1,263 106.8,247.4 80.3,206.8" />
              <polygon fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" points="103.6,138.2 87.8,162.1 144.1,164.6 142.1,104.1" />
              <polygon fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" points="214.9,138.2 175.9,103.4 174.6,164.6 230.8,162.1" />
            </svg>
            <span style={popupStyles.headerTitle}>MetaMask</span>
          </div>
          <div style={popupStyles.networkBadge}>
            <span style={popupStyles.networkDot} />
            Ethereum Sepolia
          </div>
        </div>

        {/* Body */}
        <div style={popupStyles.body}>
          <div style={{ ...popupStyles.iconWrap, background: iconBg, border: `1px solid ${iconBorder}` }}>
            {(status === "pending") && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8"
                style={{ animation: "mmSpin 1.2s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            )}
            {(status === "waiting") && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            )}
            {(status === "success") && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {(status === "error") && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>

          <p style={popupStyles.label}>
            {status === "pending" && "Sending to MetaMask…"}
            {status === "waiting" && "Approve in MetaMask"}
            {status === "success" && "Sepolia Added!"}
            {status === "error"   && "Something went wrong"}
          </p>

          <p style={popupStyles.sublabel}>
            {status === "pending" && "Opening the MetaMask network popup for you."}
            {status === "waiting" && "A MetaMask popup is waiting — look for it in your browser and approve it."}
            {status === "success" && "Sepolia network with your Alchemy RPC is now active in MetaMask."}
            {status === "error"   && "MetaMask rejected the request or an error occurred. Retry below."}
          </p>

          {/* RPC URL — always visible for manual reference */}
          <div style={popupStyles.urlSection}>
            <span style={popupStyles.urlLabel}>Your Alchemy RPC URL</span>
            <div style={popupStyles.urlBox}>
              <span style={popupStyles.urlText}>{url}</span>
            </div>
            <button
              style={{ ...popupStyles.copyBtn, ...(copied ? popupStyles.copyBtnDone : {}) }}
              onClick={handleCopy}
            >
              {copied ? (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> Copied!</>
              ) : (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg> Copy URL</>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={popupStyles.footer}>
          {status === "error" && (
            <button style={popupStyles.retryBtn} onClick={onRetry}>↺ Retry</button>
          )}
          {status === "success" && (
            <button style={popupStyles.gotItBtn} onClick={onClose}>Continue →</button>
          )}
          {(status === "pending" || status === "waiting") && (
            <button style={popupStyles.dimBtn} disabled>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ animation: "mmSpin 1.2s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
              </svg>
              &nbsp;Waiting for MetaMask…
            </button>
          )}
        </div>

        <style>{`@keyframes mmSpin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
      </div>
    </div>
  );
}

// ─── Popup inline styles ───────────────────────────────────────────────────────
const popupStyles = {
  backdrop: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.72)",
    backdropFilter: "blur(6px)",
    zIndex: 9999,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  popup: {
    width: "370px",
    background: "#24272A",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 28px 90px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)",
    fontFamily: "'SF Pro Display',-apple-system,sans-serif",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "13px 16px",
    background: "#1A1D1F",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "8px" },
  headerTitle: { color: "#fff", fontWeight: "700", fontSize: "15px", letterSpacing: "-0.2px" },
  networkBadge: {
    display: "flex", alignItems: "center", gap: "5px",
    background: "rgba(111,207,151,0.1)", border: "1px solid rgba(111,207,151,0.2)",
    borderRadius: "20px", padding: "3px 10px",
    fontSize: "11px", color: "#6FCF97", fontWeight: "600",
  },
  networkDot: {
    display: "inline-block", width: "6px", height: "6px",
    borderRadius: "50%", background: "#6FCF97", boxShadow: "0 0 5px #6FCF97",
  },
  body: {
    padding: "28px 22px 16px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
  },
  iconWrap: {
    width: "60px", height: "60px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: "4px", transition: "all 0.3s",
  },
  label: { color: "#fff", fontWeight: "700", fontSize: "17px", margin: 0, textAlign: "center", letterSpacing: "-0.3px" },
  sublabel: { color: "#9E9E9E", fontSize: "13px", margin: 0, textAlign: "center", lineHeight: 1.55, maxWidth: "290px" },
  urlSection: { width: "100%", marginTop: "6px", display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" },
  urlLabel: { color: "#666", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px" },
  urlBox: { width: "100%", background: "#1A1D1F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px" },
  urlText: { color: "#E2761B", fontSize: "11px", wordBreak: "break-all", lineHeight: 1.6, fontFamily: "'JetBrains Mono','Fira Code',monospace" },
  copyBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    background: "rgba(226,118,27,0.1)", border: "1px solid rgba(226,118,27,0.25)",
    color: "#E2761B", padding: "6px 14px", borderRadius: "7px",
    cursor: "pointer", fontSize: "12px", fontWeight: "600", transition: "all 0.2s",
  },
  copyBtnDone: { background: "rgba(111,207,151,0.12)", border: "1px solid rgba(111,207,151,0.3)", color: "#6FCF97" },
  footer: { padding: "4px 22px 22px", display: "flex", flexDirection: "column", gap: "8px" },
  gotItBtn: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg,#E2761B,#F6851B)",
    border: "none", borderRadius: "12px",
    color: "#fff", fontWeight: "700", fontSize: "15px", cursor: "pointer",
    boxShadow: "0 4px 16px rgba(226,118,27,0.35)",
  },
  retryBtn: {
    width: "100%", padding: "13px",
    background: "rgba(235,87,87,0.15)", border: "1px solid rgba(235,87,87,0.3)",
    borderRadius: "12px", color: "#EB5757", fontWeight: "700", fontSize: "15px", cursor: "pointer",
  },
  dimBtn: {
    width: "100%", padding: "13px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px", color: "#666", fontWeight: "600", fontSize: "14px",
    cursor: "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const LS_STEP = "onboardingStep";
const LS_DONE = "onboardingDone";

export default function OnboardingModal({ contract, connectWallet, account, createAccount }) {
  const [visible, setVisible]           = useState(false);
  const [step, setStep]                 = useState(1);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [username, setUsername]         = useState("");
  const [alchemyUrl, setAlchemyUrl]     = useState("");
  const [stepDone, setStepDone]         = useState(false);
  const [closing, setClosing]           = useState(false);
  // "pending" | "waiting" | "success" | "error" | null
  const [rpcPopupStatus, setRpcPopupStatus] = useState(null);
  const step3Fired = useRef(false);

  // ── On mount ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      if (localStorage.getItem(LS_DONE) === "true") return;
      if (contract && account) {
        try {
          const exists = await contract.checkUserExists(account);
          if (exists) { localStorage.setItem(LS_DONE, "true"); return; }
        } catch (_) {}
      }
      const saved = parseInt(localStorage.getItem(LS_STEP) || "1", 10);
      setStep(saved || 1);
      setVisible(true);
    };
    init();
  }, [contract, account]);

  // ── Step change side-effects ──────────────────────────────────────────────
  useEffect(() => {
    setError("");
    setStepDone(false);
    step3Fired.current = false;
    autoValidate();
    if (step === 2) window.open("https://dashboard.alchemy.com/apps/new", "_blank");
    if (step === 3) triggerAddSepolia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, account]);

  // ── Auto-add Sepolia ──────────────────────────────────────────────────────
  const triggerAddSepolia = useCallback(async () => {
    if (step3Fired.current) return;
    step3Fired.current = true;

    if (!window.ethereum) {
      setError("MetaMask not found. Please install it first (Step 1).");
      return;
    }

    // Already on Sepolia?
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId === SEPOLIA_CHAIN_ID) {
        setStepDone(true);
        setRpcPopupStatus("success");
        return;
      }
    } catch (_) {}

    setRpcPopupStatus("pending");

    // Short delay so "pending" renders before MetaMask blocks the JS thread
    setTimeout(async () => {
      setRpcPopupStatus("waiting");
      const rpcUrls = alchemyUrl ? [alchemyUrl] : ["https://rpc.sepolia.org"];
      try {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchErr) {
          if (switchErr.code === 4902 || switchErr.code === -32603) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: SEPOLIA_CHAIN_ID,
                chainName: "Sepolia test network",
                nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
                rpcUrls,
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              }],
            });
          } else throw switchErr;
        }

        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        if (chainId === SEPOLIA_CHAIN_ID) {
          setRpcPopupStatus("success");
          setStepDone(true);
        } else {
          setRpcPopupStatus("error");
          setError("Network switch didn't complete. Please retry.");
        }
      } catch (e) {
        setRpcPopupStatus("error");
        setError(e.code === 4001
          ? "You rejected the MetaMask request. Please retry."
          : e?.message || "Something went wrong.");
      }
    }, 350);
  }, [alchemyUrl]);

  const autoValidate = useCallback(async () => {
    if (step === 1 && typeof window !== "undefined" && window.ethereum?.isMetaMask) setStepDone(true);
    if ((step === 3 || step === 6) && window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        if (chainId === SEPOLIA_CHAIN_ID) setStepDone(true);
      } catch (_) {}
    }
    if (step === 5 && account) setStepDone(true);
  }, [step, account]);

  const goToStep = (n) => { setStep(n); localStorage.setItem(LS_STEP, n); };

  // ── Step Actions (all steps except 3) ────────────────────────────────────
  const handleAction = async () => {
    setError(""); setLoading(true);
    try {
      if (step === 1) {
        window.open("https://metamask.io/download/", "_blank");
        const poll = setInterval(() => {
          if (window.ethereum?.isMetaMask) { clearInterval(poll); setStepDone(true); }
        }, 1500);
      }
      if (step === 2) window.open("https://dashboard.alchemy.com/apps/new", "_blank");
      if (step === 4) { window.open("https://cloud.google.com/application/web3/faucet/ethereum/sepolia", "_blank"); setStepDone(true); }
      if (step === 5) { await connectWallet(); setStepDone(true); }
      if (step === 6) {
        try {
          await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: SEPOLIA_CHAIN_ID }] });
        } catch (switchErr) {
          if (switchErr.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: SEPOLIA_CHAIN_ID, chainName: "Sepolia test network",
                nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
                rpcUrls: alchemyUrl ? [alchemyUrl] : ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              }],
            });
          } else throw switchErr;
        }
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        if (chainId === SEPOLIA_CHAIN_ID) setStepDone(true);
        else setError("Still on wrong network. Please try again.");
      }
    } catch (e) { setError(e?.message || "Something went wrong."); }
    setLoading(false);
  };

  const handleCreateAccount = async () => {
    if (!username.trim()) return setError("Please enter a username.");
    setLoading(true); setError("");
    try {
      await createAccount({ name: username });
      localStorage.setItem(LS_DONE, "true");
      localStorage.removeItem(LS_STEP);
      setClosing(true);
      setTimeout(() => setVisible(false), 700);
    } catch (e) { setError(e?.message || "Transaction failed. Do you have enough ETH?"); }
    setLoading(false);
  };

  const handleNext = () => { if (step < STEPS.length) goToStep(step + 1); };

  const handlePopupClose = () => {
    setRpcPopupStatus(null);
    if (stepDone) handleNext();
  };

  if (!visible) return null;

  const current  = STEPS[step - 1];
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <>
      {/* Step-3 auto MetaMask popup */}
      {step === 3 && rpcPopupStatus && (
        <MetaMaskRpcPopup
          url={alchemyUrl || "https://rpc.sepolia.org (default)"}
          status={rpcPopupStatus}
          onRetry={() => { step3Fired.current = false; triggerAddSepolia(); }}
          onClose={handlePopupClose}
        />
      )}

      <div className={`${Style.overlay} ${closing ? Style.overlayOut : ""}`}>
        <div className={Style.particles}>
          {[...Array(20)].map((_, i) => (
            <span key={i} className={Style.particle} style={{ "--i": i }} />
          ))}
        </div>

        <div className={`${Style.modal} ${closing ? Style.modalOut : ""}`}>
          {/* Sidebar */}
          <div className={Style.sidebar}>
            <div className={Style.brand}>
              <div className={Style.brandIcon}>⬡</div>
              <span>BlockChat</span>
            </div>
            <div className={Style.stepsList}>
              {STEPS.map((s) => {
                const state = s.id < step ? "done" : s.id === step ? "active" : "pending";
                return (
                  <div key={s.id} className={`${Style.stepItem} ${Style[state]}`}>
                    <div className={Style.stepBullet}>
                      {state === "done" ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : s.id}
                    </div>
                    <div className={Style.stepLabel}>
                      <span className={Style.stepTitle}>{s.title}</span>
                      <span className={Style.stepSubtitle}>{s.subtitle}</span>
                    </div>
                    {s.id < STEPS.length && <div className={Style.stepConnector} />}
                  </div>
                );
              })}
            </div>
            <div className={Style.sidebarFooter}>
              <div className={Style.progressBar}>
                <div className={Style.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <span className={Style.progressText}>{step - 1} of {STEPS.length} complete</span>
            </div>
          </div>

          {/* Content */}
          <div className={Style.content}>
            <div className={Style.stepIcon}>{current.icon}</div>

            <div className={Style.stepHeader}>
              <span className={Style.stepNum}>Step {step} of {STEPS.length}</span>
              <h2 className={Style.stepHeading}>{current.title}</h2>
              <p className={Style.stepDesc}>
                {(step === 3
                ? current.description.replace(
                    "(your Alchemy URL from step 2)",
                    alchemyUrl || "(paste your Alchemy URL from step 2)"
                  )
                : current.description
              ).split("\n").map((line, i) => (
                <span key={i} style={{ display: "block", marginBottom: "6px" }}>{line}</span>
              ))}
              </p>
            </div>

            {/* Step 2: URL input */}
            {step === 2 && (
              <div className={Style.formArea}>
                <input
                  className={Style.input}
                  type="text"
                  placeholder="https://eth-sepolia.g.alchemy.com/v2/..."
                  value={alchemyUrl}
                  onChange={(e) => {
                    setAlchemyUrl(e.target.value);
                    const valid = /^https:\/\/eth-sepolia\.g\.alchemy\.com\/v2\/.+/.test(e.target.value.trim());
                    setStepDone(valid);
                    setError(valid ? "" : "Paste valid Alchemy Sepolia HTTPS URL.");
                  }}
                />
              </div>
            )}

            {/* Step 3: inline status (popup handles primary UX) */}
            {step === 3 && (
              <div style={{ textAlign: "center", marginTop: "8px" }}>
                {(rpcPopupStatus === "pending" || rpcPopupStatus === "waiting") && (
                  <p style={{ color: "#E2761B", fontSize: "13px", fontWeight: "600" }}>
                    ⏳ MetaMask popup is open — check your browser…
                  </p>
                )}
                {rpcPopupStatus === "success" && (
                  <p style={{ color: "#6FCF97", fontSize: "13px", fontWeight: "600" }}>
                    ✅ Sepolia network added successfully!
                  </p>
                )}
                {rpcPopupStatus === "error" && (
                  <p style={{ color: "#EB5757", fontSize: "13px", fontWeight: "600" }}>
                    ❌ Failed — see the popup to retry.
                  </p>
                )}
              </div>
            )}

            {/* Step 7: username */}
            {step === STEPS.length ? (
              <div className={Style.formArea}>
                <input
                  className={Style.input}
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={32}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateAccount()}
                />
                {account && (
                  <div className={Style.addressBadge}>
                    <span className={Style.addressDot} />
                    {account.slice(0, 6)}…{account.slice(-4)}
                  </div>
                )}
              </div>
            ) : (
              /* Action button — hidden for step 3 (fully automated) */
              step !== 3 && current.action && (
                <button
                  className={`${Style.actionBtn} ${stepDone ? Style.actionDone : ""}`}
                  onClick={handleAction}
                  disabled={loading || stepDone}
                >
                  {loading ? (
                    <span className={Style.spinner} />
                  ) : stepDone ? (
                    <>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Done
                    </>
                  ) : current.action}
                </button>
              )
            )}

            <p className={Style.hint}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {current.hint}
            </p>

            {error && <div className={Style.error}>{error}</div>}

            <div className={Style.nav}>
              {step > 1 && (
                <button className={Style.backBtn} onClick={() => goToStep(step - 1)}>← Back</button>
              )}
              {step < STEPS.length ? (
                <button className={Style.nextBtn} onClick={handleNext} disabled={!stepDone}>
                  Continue →
                </button>
              ) : (
                <button className={Style.nextBtn} onClick={handleCreateAccount} disabled={loading || !username.trim()}>
                  {loading ? <span className={Style.spinner} /> : "Create Account →"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}