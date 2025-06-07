import React, { useEffect, useState } from "react";

export default function TimetableApp() {
  const API_KEY = "123abc456def789ghi";

  const [fullData, setFullData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [token, setToken] = useState("");
  const [loginMsg, setLoginMsg] = useState({ text: "", isError: false });
  const [updateMsg, setUpdateMsg] = useState({ text: "", isError: false });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [timetableJSON, setTimetableJSON] = useState("");
  const [adminVisible, setAdminVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch("https://ttserver-7zps.onrender.com/api/timetable", {
      headers: { "x-api-key": API_KEY },
    })
      .then((res) => res.json())
      .then((data) => {
        setFullData(data);
        setCurrentIndex(0);
        if (data.length > 0) {
          setTimetableJSON(JSON.stringify(data, null, 2));
        }
      })
      .catch((err) => {
        setFullData([]);
        setLoginMsg({ text: "❌ Failed to load timetable", isError: true });
        console.error(err);
      });
  }, []);

  const login = () => {
    setLoginMsg({ text: "", isError: false });
    fetch("https://ttserver-7zps.onrender.com/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password: password.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setToken(data.token);
          setLoginMsg({ text: "✅ Login successful!", isError: false });
        } else {
          setLoginMsg({ text: `❌ ${data.error || "Login failed"}`, isError: true });
        }
      })
      .catch((err) => {
        setLoginMsg({ text: "❌ Network error", isError: true });
        console.error(err);
      });
  };

  const updateTimetable = () => {
    let data;
    try {
      data = JSON.parse(timetableJSON);
    } catch (e) {
      setUpdateMsg({ text: "❌ Invalid JSON", isError: true });
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
          setUpdateMsg({ text: "✅ Timetable updated successfully!", isError: false });
        } else {
          setUpdateMsg({ text: `❌ ${res.error || "Update failed"}`, isError: true });
        }
      })
      .catch((err) => {
        setUpdateMsg({ text: "❌ Network error", isError: true });
        console.error(err);
      });
  };

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📅 Timetable Viewer</h1>
          <button
            className="bg-gray-200 dark:bg-gray-800 text-sm px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Batch Switcher */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {fullData.map((batch, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`px-4 py-2 rounded-md font-medium border ${
                currentIndex === index
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-gray-300 dark:border-gray-700"
              }`}
            >
              {batch.batch || `Batch ${index + 1}`}
            </button>
          ))}
        </div>

        {/* Timetable Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fullData[currentIndex] &&
            Object.entries(fullData[currentIndex])
              .filter(([day]) => day !== "batch")
              .map(([day, periods]) => (
                <div
                  key={day}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border-l-4 border-blue-600"
                >
                  <h2 className="text-xl font-bold mb-2">📅 {day}</h2>
                  <ul className="space-y-2">
                    {periods.map((p, i) => (
                      <li
                        key={i}
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md shadow-sm"
                      >
                        <p className="text-sm font-semibold">
                          🕘 {p.time} — {p.subject}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          Room: {p.room} | Teacher: {p.teacher}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
        </div>

        {/* Admin Toggle */}
        <div className="my-8 text-center">
          <button
            onClick={() => setAdminVisible(!adminVisible)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
          >
            {adminVisible ? "Hide Admin Panel" : "Show Admin Panel"}
          </button>
        </div>

        {adminVisible && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">🔐 Admin Panel</h2>

            {!token && (
              <div className="grid gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={login}
                >
                  Login
                </button>
                <p className={loginMsg.text ? (loginMsg.isError ? "text-red-500" : "text-green-500") : ""}>{loginMsg.text}</p>
              </div>
            )}

            {token && (
              <>
                <textarea
                  rows={10}
                  className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-white mb-4"
                  value={timetableJSON}
                  onChange={(e) => setTimetableJSON(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={updateTimetable}
                >
                  Update Timetable
                </button>
                <p className={updateMsg.text ? (updateMsg.isError ? "text-red-500" : "text-green-500") : ""}>{updateMsg.text}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
