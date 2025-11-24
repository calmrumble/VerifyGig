// src/RecruiterViewer.jsx
import React, { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contrac";

export default function RecruiterViewer() {
  const { publicId } = useParams();           // optional param from URL
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState(publicId || "");
  const [rpcUrl, setRpcUrl] = useState("http://127.0.0.1:8545"); // adjust if needed

  // Validate Ethereum-like address (basic)
  const isMaybeAddress = (v) => /^0x[a-fA-F0-9]{40}$/.test(v);

  const loadVerifiedSkills = useCallback(
    async (filterWorker = "") => {
      setLoading(true);
      setError("");
      try {
        const web3 = new Web3(rpcUrl);
        const accounts = await web3.eth.getAccounts();
        const fromAddr = accounts[0] || undefined;

        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        // call getAllSkillIds
        const ids = await contract.methods.getAllSkillIds().call({ from: fromAddr });

        const verified = [];

        for (let id of ids) {
          if (!id) continue;
          const skill = await contract.methods.skills(id).call({ from: fromAddr });
          // skill is expected to have verified, worker, notes, interviewer, skillName etc.
          if (skill.verified) {
            // if filterWorker set, push only worker matches (case-insensitive)
            if (!filterWorker || skill.worker.toLowerCase() === filterWorker.toLowerCase()) {
              verified.push({ ...skill, skillId: id });
            }
          }
        }

        setSkills(verified);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load verified skills:", err);
        setError("Blockchain connection failed or skill fetch failed.");
        setLoading(false);
      }
    },
    [rpcUrl]
  );

  // initial load (uses URL param publicId if present)
  useEffect(() => {
    if (publicId) {
      setSearchValue(publicId);
      // optional: validate before loading
      if (!isMaybeAddress(publicId)) {
        setError("Invalid address in URL.");
        setSkills([]);
        setLoading(false);
        return;
      }
    }
    // load — pass publicId if present, otherwise fetch all verified
    loadVerifiedSkills(publicId || "");
  }, [publicId, loadVerifiedSkills]);

  // Search button handler: updates URL and loads skills for the entered id
  const onSearch = async () => {
    const val = (searchValue || "").trim();
    if (!val) {
      // navigate to base recruiter view (all)
      navigate("/recruiter", { replace: true });
      loadVerifiedSkills("");
      return;
    }
    if (!isMaybeAddress(val)) {
      setError("Please enter a valid Ethereum address (0x...).");
      return;
    }
    // update URL and load
    navigate(`/recruiter/${val}`, { replace: true });
    setError("");
    loadVerifiedSkills(val);
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0 }}>Verified Skills (Recruiter View)</h2>
          <div style={{ color: "#9BB8CC", marginTop: 6 }}>Browse tamper-proof verified skills from the blockchain.</div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Enter public address (0x...) or leave empty"
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "transparent",
              color: "inherit",
              minWidth: 320,
            }}
          />
          <button onClick={onSearch} style={{ padding: "8px 12px", borderRadius: 8 }}>
            Search
          </button>
        </div>
      </div>

      {loading && <div style={{ color: "#9BB8CC" }}>⏳ Loading verified skills...</div>}
      {error && <div style={{ color: "#FF9580" }}>{error}</div>}

      {!loading && !error && skills.length === 0 && (
        <div style={{ color: "#9BB8CC", padding: 18 }}>No verified skills found{searchValue ? ` for ${searchValue}` : "."}</div>
      )}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {skills.map((skill) => (
          <div
            key={skill.skillId}
            style={{
              padding: 14,
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700 }}>{skill.skillName || "Unnamed skill"}</div>
              <div style={{ color: "#00ffc3" }}>ID: {skill.skillId}</div>
            </div>

            <div style={{ color: "#9BB8CC", marginTop: 6 }}>
              Worker: <span style={{ color: "#D9F7FF" }}>{skill.worker}</span>
            </div>

            <div style={{ color: "#9BB8CC", marginTop: 6 }}>
              Interviewer: <span style={{ color: "#D9F7FF" }}>{skill.interviewer}</span>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ color: "#D9F7FF", fontWeight: 600 }}>Notes</div>
              <div style={{ color: "#CFEFF8", marginTop: 6 }}>{skill.notes || <span style={{ color: "#89B3CC" }}>— no notes provided —</span>}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
