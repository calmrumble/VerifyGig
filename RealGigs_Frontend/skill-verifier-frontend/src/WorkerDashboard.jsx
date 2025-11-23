import React, { useState } from "react";

// UI-only redesign (logic unchanged)
// Add fonts in index.html for full effect:
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">

function WorkerDashboard({ contract, account }) {
  const [skillId, setSkillId] = useState("");
  const [skillName, setSkillName] = useState("");

  const submitSkill = async () => {
    try {
      const fee = await contract.methods.skillFee().call();
      await contract.methods.requestSkillVerification(skillId, skillName).send({
        from: account,
        value: fee,
      });
      alert("✅ Skill requested!");
    } catch (err) {
      alert("❌ Error submitting skill: " + err.message);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      padding: 36,
      background: "radial-gradient(1200px 620px at 0% 0%, rgba(3,169,244,0.06), transparent), linear-gradient(180deg,#071225,#0b1020)",
      color: "#E6F0FA",
      fontFamily: "'Open Sans', sans-serif",
    },
    container: { maxWidth: 900, margin: "0 auto" },
    title: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: 24,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    card: {
      marginTop: 20,
      padding: 24,
      borderRadius: 14,
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.05)",
      boxShadow: "0 6px 22px rgba(0,0,0,0.36)",
    },
    label: { fontSize: 14, color: "#9BB8CC", marginTop: 14 },
    input: {
      width: "100%",
      padding: "12px 14px",
      marginTop: 6,
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.015)",
      color: "#E6F0FA",
      outline: "none",
      fontSize: 14,
    },
    button: {
      marginTop: 20,
      padding: "12px 18px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      background: "linear-gradient(90deg,#03a9f4,#00ffc3)",
      color: "#001214",
      fontWeight: 700,
      fontSize: 15,
      boxShadow: "0 8px 22px rgba(3,169,244,0.18)",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.title}>👨‍💻 Worker Dashboard</div>

        <div style={styles.card}>
          <div style={styles.label}>Skill ID</div>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter skill ID"
            value={skillId}
            onChange={(e) => setSkillId(e.target.value)}
          />

          <div style={styles.label}>Skill Name</div>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter skill name"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
          />

          <button style={styles.button} onClick={submitSkill}>
            Submit for Verification
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkerDashboard;
