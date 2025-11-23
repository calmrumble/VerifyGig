import React, { useState } from "react";

// UI-only update of AdminDashboard — appearance changed, logic preserved.
// NOTE: This file uses plain CSS-in-JS styles and SVG icons so it works without
// any external CSS frameworks. To use the recommended fonts add the following
// to your HTML head (optional but recommended):
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">

function AdminDashboard({ contract, account }) {
  const [newAddress, setNewAddress] = useState("");

  const addInterviewer = async () => {
    try {
      await contract.methods.authorizeInterviewer(newAddress).send({ from: account });
      alert("✅ Interviewer added successfully!");
      setNewAddress("");
    } catch (err) {
      alert("❌ Error adding interviewer: " + err.message);
    }
  };

  // --- Styles (CSS-in-JS) ---
const styles = {
  page: {
    minHeight: "100vh",
    padding: "18px 20px", // reduced vertical padding so header is shorter
    background:
      "radial-gradient(1200px 600px at 10% 10%, rgba(3,169,244,0.06), transparent), linear-gradient(180deg,#071225 0%, #0b1020 100%)",
    color: "#E6F0FA",
    fontFamily: "'Open Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: 1100,           // slightly wider for nicer layout on large screens
    margin: "0 auto",
    backdropFilter: "blur(4px)",
    padding: "16px 20px",     // smaller padding inside container
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,                  // tightened gap
    marginBottom: 12,         // reduce space below header
    paddingTop: 6,            // small top padding
    paddingBottom: 6,
  },
  titleBlock: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  logo: {
    width: 44,                // smaller logo
    height: 44,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#03a9f4,#00ffc3)",
    color: "#001214",
    fontWeight: 700,
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "0 6px 18px rgba(2,136,209,0.08)",
    fontSize: 16,
  },
  headline: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    fontSize: 18,             // reduced headline size
    lineHeight: 1.05,
    color: "#E8F6FF",
    margin: 0,
  },
  subtitle: {
    fontSize: 12,
    color: "#A9C9DA",
    marginTop: 2,
  },
  card: {
    marginTop: 12,
    background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    border: "1px solid rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 8px 24px rgba(2,8,23,0.5)",
  },
  formRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: 220,
    padding: "11px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.012)",
    color: "#E6F0FA",
    outline: "none",
    fontSize: 14,
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg,#03a9f4,#00ffc3)",
    color: "#001214",
    fontWeight: 700,
    boxShadow: "0 6px 18px rgba(3,169,244,0.10)",
    fontSize: 14,
  },
  btnGhost: {
    padding: "9px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "transparent",
    color: "#A9C9DA",
    cursor: "pointer",
    fontSize: 13,
  },
  hint: {
    fontSize: 12,
    color: "#89B3CC",
    marginTop: 8,
  },
  chainLine: {
    height: 1,
    background: "linear-gradient(90deg, rgba(3,169,244,0.20), rgba(0,255,195,0.10))",
    margin: "14px 0",
    borderRadius: 2,
  },
};



  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.titleBlock}>
            <div style={styles.logo}>GC</div>
            <div>
              <div style={styles.headline}>Admin Dashboard</div>
              <div style={styles.subtitle}>Manage interviewers and maintain platform integrity</div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#9fcfe8", fontWeight: 600 }}>Connected</div>
            <div style={{ fontSize: 12, color: "#8fb6c8" }}>{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}</div>
          </div>
        </header>

        <main style={styles.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: 16, color: "#EAF8FF" }}>Authorize Interviewer</h3>
              <p style={{ margin: 0, marginTop: 6, color: "#A9C9DA", fontSize: 13 }}>Add a new Ethereum address to the list of authorized interviewers.</p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button style={styles.btnGhost} onClick={() => { setNewAddress(""); }} title="Clear field">Clear</button>
            </div>
          </div>

          <div style={styles.chainLine} />

          <div style={styles.formRow}>
            <input
              style={styles.input}
              type="text"
              placeholder="0x1234...abcd"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />

            <button
              style={styles.btnPrimary}
              onClick={addInterviewer}
              disabled={!newAddress || !account}
              aria-disabled={!newAddress || !account}
            >
              {/* SVG icon for plus */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="#001214" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add Interviewer
            </button>
          </div>

          <div style={styles.hint}>
            <strong style={{ color: "#D9F7FF" }}>Tip:</strong> Use a checksummed Ethereum address (starting with <code style={{ color: "#BEEBFF" }}>0x</code>). Transactions will be sent from the connected account.
          </div>
        </main>

        <footer style={{ marginTop: 18, color: "#6F9DB3", fontSize: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>GigChain • Skill Ledger</div>
            <div>Built for transparency • {new Date().getFullYear()}</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AdminDashboard;
