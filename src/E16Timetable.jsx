import React, { useEffect, useState } from "react";

export default function TimetableApp() {
  const API_KEY = "123abc456def789ghi";

  const [fullData, setFullData] = useState([]);
  const [token, setToken] = useState("");
  const [loginMsg, setLoginMsg] = useState({ text: "", isError: false });
  const [updateMsg, setUpdateMsg] = useState({ text: "", isError: false });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [timetableJSON, setTimetableJSON] = useState("");
  const [adminVisible, setAdminVisible] = useState(false);
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = () => {
    setLoginMsg({ text: "", isError: false });
    fetch("https://ttserver-7zps.onrender.com/api/timetable", {
      headers: { "x-api-key": API_KEY },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        const batches = Array.isArray(data) ? data : [data];
        setFullData(batches);
        setTimetableJSON(JSON.stringify(batches, null, 2));
        setSelectedBatchIndex(0); // Reset to first batch on reload
      })
      .catch((err) => {
        setFullData([]);
        setLoginMsg({ text: "Failed to fetch timetable: " + err.message, isError: true });
      });
  };

  const login = (e) => {
    e.preventDefault();
    setLoginMsg({ text: "", isError: false });
    if (!username.trim() || !password.trim()) {
      setLoginMsg({ text: "Please enter username and password.", isError: true });
      return;
    }
    fetch("https://ttserver-7zps.onrender.com/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password: password.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setToken(data.token);
          setLoginMsg({ text: "Login successful!", isError: false });
        } else {
          setLoginMsg({ text: data.error || "Login failed", isError: true });
        }
      })
      .catch(() => setLoginMsg({ text: "Login error: Network error", isError: true }));
  };

  const logout = () => {
    setToken("");
    setAdminVisible(false);
    setLoginMsg({ text: "", isError: false });
    setUpdateMsg({ text: "", isError: false });
    setUsername("");
    setPassword("");
  };

  const updateTimetable = () => {
    setUpdateMsg({ text: "", isError: false });
    let data;
    try {
      data = JSON.parse(timetableJSON);
      if (!Array.isArray(data)) throw new Error("Data must be a JSON array");
    } catch (err) {
      setUpdateMsg({ text: "Invalid JSON: " + err.message, isError: true });
      return;
    }
    if (!token) {
      setUpdateMsg({ text: "Not authorized. Please login.", isError: true });
      return;
    }
    fetch("https://ttserver-7zps.onrender.com/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, data }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUpdateMsg({ text: res.message || "Updated successfully!", isError: false });
          fetchTimetable();
        } else {
          setUpdateMsg({ text: res.error || "Update failed", isError: true });
        }
      })
      .catch(() => setUpdateMsg({ text: "Update error: Network error", isError: true }));
  };

  const formatSubject = (subj) =>
    subj
      .split(",")
      .map((s) => s.trim())
      .join(", ");

  return (
    <>
      <style>{`
        /* Reset and base */
        * {
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #121212;
          color: #eee;
          margin: 0;
          padding: 1rem 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        header {
          width: 100%;
          max-width: 1200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #444;
          padding-bottom: 0.5rem;
        }
        header h1 {
          font-weight: 700;
          font-size: 1.8rem;
          letter-spacing: 1px;
          color: #00bcd4;
        }
        button {
          background: #00bcd4;
          border: none;
          padding: 0.6rem 1.2rem;
          font-size: 1rem;
          font-weight: 600;
          color: #121212;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          box-shadow: 0 4px 8px rgb(0 188 212 / 0.3);
          user-select: none;
        }
        button:hover:not(:disabled) {
          background: #0097a7;
          box-shadow: 0 6px 12px rgb(0 151 167 / 0.5);
        }
        button:disabled {
          background: #333;
          cursor: not-allowed;
          box-shadow: none;
          color: #777;
        }
        /* Layout */
        main {
          width: 100%;
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        /* Batch toggle */
        .batch-toggle {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .batch-toggle button {
          background: #222;
          color: #00bcd4;
          padding: 0.5rem 1rem;
          font-weight: 600;
          border-radius: 20px;
          box-shadow: 0 0 8px transparent;
          transition: all 0.3s ease;
          user-select: none;
        }
        .batch-toggle button:hover {
          background: #00bcd4;
          color: #121212;
          box-shadow: 0 4px 12px #00bcd4cc;
        }
        .batch-toggle button.active {
          background: #00bcd4;
          color: #121212;
          box-shadow: 0 6px 16px #00bcd4cc;
          cursor: default;
        }
        /* Batch Section */
        .batch-section {
          background: #1e1e1e;
          border-radius: 12px;
          padding: 1.5rem 2rem;
          box-shadow: 0 8px 16px rgb(0 188 212 / 0.2);
          min-height: 400px;
        }
        .batch-title {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 1rem;
          border-bottom: 2px solid #00bcd4;
          padding-bottom: 0.3rem;
          color: #00bcd4;
          text-align: center;
        }
        /* Days container */
        .days-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: flex-start;
        }
        .day-column {
          flex: 1 1 220px;
          background: #292929;
          border-radius: 10px;
          padding: 1rem;
          box-shadow: inset 0 0 10px #00bcd4aa;
          display: flex;
          flex-direction: column;
          max-height: 600px;
          overflow-y: auto;
        }
        .day-title {
          font-weight: 600;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #00e5ff;
          border-bottom: 1px solid #00bcd4;
          padding-bottom: 0.3rem;
          text-align: center;
        }
        /* Slot cards */
        .slot-card {
          background: #121212;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgb(0 188 212 / 0.4);
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          transition: transform 0.2s ease;
          cursor: default;
          user-select: none;
        }
        .slot-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgb(0 188 212 / 0.7);
        }
        .slot-time {
          font-weight: 700;
          font-size: 1rem;
          color: #00bcd4;
          margin-bottom: 0.3rem;
        }
        .slot-subject {
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 0.2rem;
          color: #80deea;
        }
        .slot-room,
        .slot-teacher {
          font-size: 0.9rem;
          color: #b0bec5;
        }
        /* Refresh button */
        #refreshBtn {
          margin-bottom: 1rem;
          align-self: flex-start;
        }
        /* Messages */
        #userMessage {
          margin-bottom: 1rem;
          font-weight: 600;
          color: #f44336;
          min-height: 1.2rem;
        }
        #userMessage.success {
          color: #4caf50;
        }
        /* Admin Panel */
        section.admin-panel {
          max-width: 600px;
          background: #1e1e1e;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgb(0 188 212 / 0.3);
          margin-top: 2rem;
        }
        section.admin-panel h2 {
          color: #00bcd4;
          margin-bottom: 1rem;
          font-weight: 700;
          font-size: 1.8rem;
          text-align: center;
        }
        form#loginForm {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        label {
          font-weight: 600;
          color: #80deea;
        }
        input[type="text"],
        input[type="password"],
        textarea {
          background: #121212;
          border: 1.5px solid #00bcd4;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #eee;
          font-size: 1rem;
          font-family: monospace;
          resize: vertical;
          transition: border-color 0.3s ease;
        }
        input[type="text"]:focus,
        input[type="password"]:focus,
        textarea:focus {
          outline: none;
          border-color: #00e5ff;
          box-shadow: 0 0 8px #00e5ffaa;
        }
        textarea {
          min-height: 200px;
          font-family: monospace;
        }
        #updateTimetableBtn {
          margin-top: 0.5rem;
          width: 100%;
        }
        #adminMessage {
          margin-top: 0.8rem;
          font-weight: 600;
          min-height: 1.2rem;
          text-align: center;
        }
        #adminMessage.error {
          color: #f44336;
        }
        #adminMessage.success {
          color: #4caf50;
        }
        #adminLogoutBtn {
          margin-top: 1.5rem;
          width: 100%;
          background: #f44336;
          color: white;
          box-shadow: 0 4px 8px rgb(244 67 54 / 0.6);
        }
        #adminLogoutBtn:hover {
          background: #d32f2f;
          box-shadow: 0 6px 12px rgb(211 47 47 / 0.8);
        }
        /* Scrollbar for day columns */
        .day-column::-webkit-scrollbar {
          width: 6px;
        }
        .day-column::-webkit-scrollbar-thumb {
          background-color: #00bcd4aa;
          border-radius: 3px;
        }
        /* Responsive */
        @media (max-width: 900px) {
          .days-container {
            flex-direction: column;
          }
          .day-column {
            max-height: none;
            flex: none;
          }
          .batch-toggle {
            justify-content: center;
          }
        }
      `}</style>

      <header>
        <h1>Timetable Viewer</h1>
        <button
          onClick={() => {
            setAdminVisible((v) => !v);
            setLoginMsg({ text: "", isError: false });
            setUpdateMsg({ text: "", isError: false });
          }}
          aria-label={adminVisible ? "Switch to User View" : "Switch to Admin Login"}
        >
          {adminVisible ? "Back to User View" : "Admin Login"}
        </button>
      </header>

      <main>
        {/* User View */}
        {!adminVisible && (
          <>
            <button id="refreshBtn" onClick={fetchTimetable} aria-label="Refresh Timetable">
              Refresh Timetable
            </button>
            <div
              id="userMessage"
              className={loginMsg.isError ? "" : "success"}
              role="alert"
              aria-live="polite"
            >
              {loginMsg.text}
            </div>

            {fullData.length > 1 && (
              <nav className="batch-toggle" aria-label="Select batch timetable">
                {fullData.map((batch, idx) => (
                  <button
                    key={idx}
                    className={idx === selectedBatchIndex ? "active" : ""}
                    onClick={() => setSelectedBatchIndex(idx)}
                    aria-current={idx === selectedBatchIndex ? "true" : undefined}
                    aria-label={`View timetable for batch ${batch.batch || idx + 1}`}
                  >
                    {batch.batch || `Batch ${idx + 1}`}
                  </button>
                ))}
              </nav>
            )}

            {fullData.length === 0 && <p>No timetable data found.</p>}

            {fullData.length > 0 && (
              <section
                className="batch-section"
                aria-label={`Timetable for ${
                  fullData[selectedBatchIndex].batch || `Batch ${selectedBatchIndex + 1}`
                }`}
              >
                <h2 className="batch-title">
                  {fullData[selectedBatchIndex].batch || `Batch ${selectedBatchIndex + 1}`}
                </h2>
                <div className="days-container">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                    (day) => {
                      const dayData = fullData[selectedBatchIndex][day];
                      if (Array.isArray(dayData) && dayData.length > 0) {
                        return (
                          <div key={day} className="day-column" tabIndex={0}>
                            <h3 className="day-title">{day}</h3>
                            {dayData.map((slot, i) => (
                              <article
                                key={i}
                                className="slot-card"
                                aria-label={`${slot.subject} from ${slot.time} in room ${slot.room}`}
                              >
                                <div className="slot-time">{slot.time}</div>
                                <div className="slot-subject" title={slot.subject}>
                                  {formatSubject(slot.subject)}
                                </div>
                                <div className="slot-room">Room: {slot.room}</div>
                                <div className="slot-teacher">Teacher: {slot.teacher}</div>
                              </article>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
              </section>
            )}
          </>
        )}

        {/* Admin Panel */}
        {adminVisible && (
          <section className="admin-panel" aria-label="Admin Panel">
            {!token ? (
              <>
                <h2>Admin Login</h2>
                <form id="loginForm" onSubmit={login} aria-label="Admin Login Form">
                  <label htmlFor="adminUsername">Username:</label>
                  <input
                    type="text"
                    id="adminUsername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    aria-required="true"
                  />
                  <label htmlFor="adminPassword">Password:</label>
                  <input
                    type="password"
                    id="adminPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    aria-required="true"
                  />
                  <button type="submit" aria-label="Login as admin">
                    Login
                  </button>
                </form>
                <div
                  id="loginMessage"
                  className={loginMsg.isError ? "error" : "success"}
                  role="alert"
                  aria-live="polite"
                >
                  {loginMsg.text}
                </div>
              </>
            ) : (
              <>
                <h2>Admin Panel - Update Timetable</h2>
                <textarea
                  id="timetableTextarea"
                  rows={15}
                  placeholder="Paste timetable JSON array here"
                  value={timetableJSON}
                  onChange={(e) => setTimetableJSON(e.target.value)}
                  aria-label="Timetable JSON editor"
                ></textarea>
                <button id="updateTimetableBtn" onClick={updateTimetable} aria-label="Update timetable">
                  Update Timetable
                </button>
                <div
                  id="adminMessage"
                  className={updateMsg.isError ? "error" : "success"}
                  role="alert"
                  aria-live="polite"
                >
                  {updateMsg.text}
                </div>
                <button id="adminLogoutBtn" onClick={logout} aria-label="Logout admin">
                  Logout
                </button>
              </>
            )}
          </section>
        )}
      </main>
    </>
  );
}
