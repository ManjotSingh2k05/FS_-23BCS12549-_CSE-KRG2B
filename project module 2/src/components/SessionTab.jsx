import { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";

export default function SessionTab() {
  const [sessionTitle, setSessionTitle] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [generatedSession, setGeneratedSession] = useState(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const qrRef = useRef();

  const classOptions = ["A", "B", "C", "All"];

  const toggleClass = (cls) => {
    if (selectedClasses.includes(cls)) {
      setSelectedClasses(selectedClasses.filter((c) => c !== cls));
    } else {
      if (cls === "All") setSelectedClasses(["All"]);
      else setSelectedClasses(selectedClasses.filter((c) => c !== "All").concat(cls));
    }
  };

  const handleCreateSession = () => {
    if (!sessionTitle || selectedClasses.length === 0 || (hours === 0 && minutes === 0)) {
      return alert("Please fill all fields.");
    }

    const durationSeconds = hours * 3600 + minutes * 60;

    const newSession = {
      id: Date.now(),
      title: sessionTitle,
      eligibleClasses: selectedClasses.join(", "),
      createdAt: new Date().toLocaleString(),
      qrValue: `SESSION_${Date.now()}`,
      duration: durationSeconds,
      timeLeft: durationSeconds,
    };

    setSessions([newSession, ...sessions]);
    setGeneratedSession(newSession);
    setShowQRModal(true);

    // reset fields
    setSessionTitle("");
    setSelectedClasses([]);
    setHours(0);
    setMinutes(0);
  };

  // Countdown effect for sessions
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prevSessions) =>
        prevSessions.map((s) => {
          if (s.timeLeft > 0) {
            return { ...s, timeLeft: s.timeLeft - 1 };
          } else {
            return { ...s, timeLeft: 0 };
          }
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current.querySelector("svg");
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedSession.title}_QR.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Session</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter session title"
          className="w-full border px-4 py-2 rounded-md"
          value={sessionTitle}
          onChange={(e) => setSessionTitle(e.target.value)}
        />

        <div>
          <p className="font-medium mb-2">Select Eligible Classes:</p>
          <div className="flex flex-wrap gap-3">
            {classOptions.map((cls) => (
              <button
                key={cls}
                onClick={() => toggleClass(cls)}
                className={`px-4 py-2 rounded-md border ${
                  selectedClasses.includes(cls)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-1/2 border px-4 py-2 rounded-md"
          />
          <input
            type="number"
            min="0"
            placeholder="Minutes"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-1/2 border px-4 py-2 rounded-md"
          />
        </div>

        <button
          onClick={handleCreateSession}
          className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600"
        >
          Create Session
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Ongoing Sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-gray-500">No ongoing sessions yet.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`p-3 border rounded-md bg-gray-50 flex justify-between items-center`}
              >
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-gray-600">Eligible: {s.eligibleClasses}</p>
                  <p className="text-xs text-gray-500">
                    {s.timeLeft > 0 ? `Time left: ${formatTime(s.timeLeft)}` : "Expired"}
                  </p>
                </div>

                {s.timeLeft > 0 && (
                  <button
                    onClick={() => {
                      setGeneratedSession(s);
                      setShowQRModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Show QR
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showQRModal && generatedSession && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">{generatedSession.title}</h3>
            <div ref={qrRef} className="flex justify-center mb-4">
              <QRCode value={generatedSession.qrValue} size={200} />
            </div>
            <button
              onClick={handleDownloadQR}
              className="mb-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Download QR
            </button>
            <button
              onClick={() => setShowQRModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
