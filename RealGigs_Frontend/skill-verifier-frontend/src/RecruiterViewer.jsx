import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contrac";

// UI-only refreshed RecruiterViewer (JSX). Logic and Web3 calls are unchanged.
// Recommend adding these fonts to your index.html for the intended look:
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">

function RecruiterViewer() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const web3 = new Web3("http://127.0.0.1:8545"); // Update if needed
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        // ✅ Use 'from' field to avoid Web3ValidatorError
        const ids = await contract.methods.getAllSkillIds().call({ from: accounts[0] });

        const verified = [];

        for (let id of ids) {
          const skill = await contract.methods.skills(id).call({ from: accounts[0] });
          if (skill.verified) {
            verified.push({ ...skill, skillId: id });
          }
        }

        setSkills(verified);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to load verified skills:", err);
        setError("Blockchain connection failed or skill fetch failed.");
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  // ---------- Styles (inline, JS object) ----------
  const styles = {
    page: {
      minHeight: "100vh",
      padding: 36,
      background: "radial-gradient(1200px 600px at 10% 10%, rgba(3,169,244,0.04), transparent), linear-gradient(180deg,#071225 0%, #0b1020 100%)",
      color: "#E6F0FA",
      fontFamily: "'Open Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    },
    container: {
      maxWidth: 980,
      margin: "0 auto",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 20,
    },
    title: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: 22,
      color: "#E8F6FF",
    },
    subtitle: {
      fontSize: 13,
      color: "#9BB8CC",
    },
    list: {
      marginTop: 12,
      display: "grid",
      gap: 14,
    },
    card: {
      background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
      border: "1px solid rgba(255,255,255,0.04)",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 8px 30px rgba(2,8,23,0.6)",
    },
    skillHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 8,
    },
    skillName: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: 16,
      fontWeight: 600,
      color: "#EAF8FF",
    },
    meta: {
      fontSize: 13,
      color: "#9BB8CC",
    },
    notes: {
      marginTop: 8,
      fontSize: 14,
      color: "#CFEFF8",
    },
    empty: {
      padding: 20,
      textAlign: "center",
      color: "#9BB8CC",
    },
  };

  if (loading)
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <div>
              <div style={styles.title}>📋 Verified Skills (Recruiter View)</div>
              <div style={styles.subtitle}>Browse tamper-proof verified skills from the blockchain.</div>
            </div>
          </div>

          <div style={styles.empty}>⏳ Loading verified skills...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <div>
              <div style={styles.title}>📋 Verified Skills (Recruiter View)</div>
              <div style={styles.subtitle}>Browse tamper-proof verified skills from the blockchain.</div>
            </div>
          </div>

          <div style={{ ...styles.empty, color: "#FF9580" }}>{error}</div>
        </div>
      </div>
    );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>📋 Verified Skills (Recruiter View)</div>
            <div style={styles.subtitle}>Browse tamper-proof verified skills from the blockchain.</div>
          </div>
        </div>

        <div style={styles.list}>
          {skills.length === 0 && <div style={styles.empty}>No verified skills yet.</div>}

          {skills.map((skill) => (
            <div key={skill.skillId} style={styles.card}>
              <div style={styles.skillHeader}>
                <div style={styles.skillName}>✅ {skill.skillName}</div>
                <div style={styles.meta}>ID: <span style={{ color: "#00ffc3" }}>{skill.skillId}</span></div>
              </div>

              <div style={styles.meta}>Worker: {skill.worker}</div>
              <div style={styles.meta}>Interviewer: {skill.interviewer}</div>

              <div style={styles.notes}>
                <strong style={{ color: "#D9F7FF" }}>Notes:</strong>
                <div style={{ marginTop: 6 }}>{skill.notes || <span style={{ color: "#89B3CC" }}>— no notes provided —</span>}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecruiterViewer;
