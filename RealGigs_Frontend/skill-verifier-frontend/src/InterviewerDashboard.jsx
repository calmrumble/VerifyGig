import React, { useEffect, useState } from "react";

// UI-ONLY UPGRADE — logic untouched
// Works with JSX (no TypeScript). Styling is futuristic, clean, and blockchain-themed.
// To enable recommended fonts, add to index.html:
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">

function InterviewerDashboard({ contract, account }) {
  const [skills, setSkills] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const ids = await contract.methods.getAllSkillIds().call();

        if (!ids || ids.length === 0) {
          setSkills([]);
          return;
        }

        const pending = [];
        for (let id of ids) {
          if (!id) continue;
          const skill = await contract.methods.skills(id).call();
          if (!skill.verified && skill.interviewer === "0x0000000000000000000000000000000000000000") {
            pending.push(skill);
          }
        }

        setSkills(pending);
      } catch (err) {
        console.error("❌ Error fetching skills:", err);
        setSkills([]);
      }
    };

    fetchSkills();
  }, [contract]);

  const verify = async (id) => {
    try {
      await contract.methods.verifySkill(id, true, notes).send({ from: account });
      alert("✅ Verified & Paid");
    } catch (err) {
      alert("❌ Error verifying skill: " + err.message);
    }
  };

  // ---------- STYLES ----------
  const styles = {
    page: {
      minHeight: "100vh",
      padding: "36px",
      background: "radial-gradient(1400px 700px at 0% 0%, rgba(3,169,244,0.08), transparent), linear-gradient(180deg,#071225,#0b1020)",
      color: "#E6F0FA",
      fontFamily: "'Open Sans', sans-serif",
    },
    container: {
      maxWidth: 980,
      margin: "0 auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: 24,
      display: "flex",
      gap: 10,
      alignItems: "center",
    },
    card: {
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.05)",
      padding: 20,
      borderRadius: 14,
      marginBottom: 20,
      boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
    },
    label: {
      fontSize: 14,
      color: "#A9C9DA",
      marginBottom: 6,
    },
    textarea: {
      width: "100%",
      minHeight: 80,
      background: "rgba(255,255,255,0.015)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10,
      padding: "10px 12px",
      color: "#E6F0FA",
      outline: "none",
      resize: "vertical",
      marginTop: 8,
    },
    button: {
      marginTop: 12,
      padding: "10px 18px",
      background: "linear-gradient(90deg,#03a9f4,#00ffc3)",
      border: "none",
      borderRadius: 10,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      color: "#001214",
      boxShadow: "0 8px 22px rgba(3,169,244,0.18)",
    },
    empty: {
      textAlign: "center",
      padding: 24,
      fontSize: 15,
      color: "#9BB8CC",
    },
    skillTitle: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 4,
    },
    meta: {
      fontSize: 13,
      color: "#88A8BF",
      marginBottom: 12,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.title}>🧑‍💼 Interviewer Dashboard</div>

          <div style={{ textAlign: "right", fontSize: 13 }}>
            <div style={{ color: "#9fcfe8", fontWeight: 600 }}>Connected</div>
            <div style={{ color: "#8fb6c8" }}>
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
            </div>
          </div>
        </div>

        {/* NO SKILLS */}
        {skills.length === 0 && <div style={styles.empty}>No pending skill verifications.</div>}

        {/* SKILL CARDS */}
        {skills.map((skill) => (
          <div key={skill.skillId} style={styles.card}>
            <div style={styles.skillTitle}>
              {skill.skillName} <span style={{ color: "#00ffc3", fontSize: 13 }}>(ID: {skill.skillId})</span>
            </div>

            <div style={styles.meta}>Submitted by: {skill.worker}</div>

            <div style={styles.label}>Notes</div>
            <textarea
              style={styles.textarea}
              placeholder="Write your evaluation notes..."
              onChange={(e) => setNotes(e.target.value)}
            />

            <button style={styles.button} onClick={() => verify(skill.skillId)}>
              Verify & Get Paid
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewerDashboard;
