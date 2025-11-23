// src/App.jsx  (replace your current file)
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contrac";
import AdminDashboard from "./AdminDashboard";
import InterviewerDashboard from "./InterviewerDashboard";
import WorkerDashboard from "./WorkerDashboard";
import RecruiterViewer from "./RecruiterViewer";
import { Routes, Route, Link } from "react-router-dom";

export default function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const loadBlockchain = async () => {
      if (window.location.pathname === "/recruiter") return;

      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const deployedContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        setAccount(accounts[0]);
        setContract(deployedContract);

        const adminAddress = await deployedContract.methods.admin().call();
        if (accounts[0].toLowerCase() === adminAddress.toLowerCase()) {
          setRole("admin");
        } else {
          const isInterviewer = await deployedContract.methods.authorizedInterviewers(accounts[0]).call();
          if (isInterviewer) setRole("interviewer");
          else setRole("worker");
        }
      } else {
        alert("Please install MetaMask to use this dApp");
      }
    };

    loadBlockchain();
  }, []);

  // FORCE full-viewport background by using fixed positioning on the page container.
  // This prevents parent layout from shadowing or clipping the background.
  const styles = {
    pageFixed: {
      position: "fixed",
      inset: 0,              // top:0 right:0 bottom:0 left:0
      zIndex: 0,
      background:
        "radial-gradient(1200px 600px at 10% 10%, rgba(3,169,244,0.04), transparent), linear-gradient(180deg,#071225 0%, #0b1020 100%)",
      color: "#E6F0FA",
      fontFamily: "'Open Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      boxSizing: "border-box",
      padding: "24px 28px",
    },
    container: {
      maxWidth: 1200,
      margin: "0 auto",
      position: "relative",
      zIndex: 1, // ensure content sits above background
    },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18 },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    logo: { width: 48, height: 48, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg,#03a9f4,#00ffc3)", color: "#001214", fontWeight: 800, fontFamily: "'Poppins', sans-serif" },
    title: { fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700 },
    subtitle: { fontSize: 13, color: "#9BB8CC" },
    nav: { display: "flex", gap: 8, alignItems: "center" },
    link: { color: "#BEEBFF", padding: "8px 12px", borderRadius: 8, textDecoration: "none", fontWeight: 600 },
    cardWrapper: { marginTop: 12, padding: 18, borderRadius: 12, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", width: "100%" },
    heroBox: { maxWidth: 980, margin: "0 auto", padding: "28px 32px", borderRadius: 12, background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))", textAlign: "center" },
    heroTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 700, margin: 0 },
    heroSubtitle: { marginTop: 8, color: "#9BB8CC" },
  };

  return (
    // pageFixed is fixed and covers full viewport
    <div style={styles.pageFixed}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logo}>GC</div>
            <div>
              <div style={styles.title}>RealGigs • Skill Verifier</div>
              <div style={styles.subtitle}>Verify Skills. Build Trust. Empower Talent.</div>
            </div>
          </div>

          <nav style={styles.nav}>
            <Link to="/" style={styles.link} aria-label="home">Dashboard</Link>
            <Link to="/recruiter" style={styles.link} aria-label="recruiter-view">Recruiter View</Link>
            <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.03)", margin: "0 8px" }} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: account ? "#9fe8ff" : "#ff9b9b", fontWeight: 700 }}>
                {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
              </div>
              <div style={{ fontSize: 12, color: "#9bb8cc" }}>{role ? `Role: ${role}` : "Detecting role..."}</div>
            </div>
          </nav>
        </header>

        <main style={styles.cardWrapper}>
          <Routes>
            <Route path="/recruiter" element={<RecruiterViewer />} />
            <Route
              path="/"
              element={
                <div>
                  <div style={styles.heroBox}>
                    <h2 style={styles.heroTitle}>Welcome to RealGigs</h2>
                    <p style={styles.heroSubtitle}>A decentralized platform for transparent skill verification</p>
                    {!role && <p style={{ marginTop: 12, color: "#9BB8CC" }}>Connecting to blockchain and checking role...</p>}
                  </div>

                  <div style={{ marginTop: 18 }}>
                    {role === "admin" && <AdminDashboard contract={contract} account={account} />}
                    {role === "interviewer" && <InterviewerDashboard contract={contract} account={account} />}
                    {role === "worker" && <WorkerDashboard contract={contract} account={account} />}
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        <footer style={{ marginTop: 18, textAlign: "center", color: "#6F9DB3", fontSize: 13 }}>
          GigChain • Skill Ledger • Built for transparency • {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
