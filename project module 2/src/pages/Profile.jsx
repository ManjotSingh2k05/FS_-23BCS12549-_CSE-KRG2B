import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const scannerRef = useRef(null);

  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      subject: "Math",
      attended: 8,
      total: 10,
      percentage: 80,
      sessions: [
        { date: "2025-09-20", status: "Present" },
        { date: "2025-09-22", status: "Absent" },
        { date: "2025-09-25", status: "Present" },
      ],
    },
    {
      subject: "Physics",
      attended: 7,
      total: 10,
      percentage: 70,
      sessions: [
        { date: "2025-09-19", status: "Absent" },
        { date: "2025-09-21", status: "Present" },
        { date: "2025-09-24", status: "Present" },
      ],
    },
    {
      subject: "Chemistry",
      attended: 9,
      total: 10,
      percentage: 90,
      sessions: [
        { date: "2025-09-19", status: "Absent" },
        { date: "2025-09-19", status: "Absent" },
        { date: "2025-09-18", status: "Present" },
        { date: "2025-09-23", status: "Present" },
        { date: "2025-09-27", status: "Present" },
      ],
    },
  ]);

  const [events, setEvents] = useState([
    { title: "Science Fair", date: "2025-10-01" },
    { title: "Guest Lecture", date: "2025-09-28" },
    { title: "Workshop", date: "2025-09-26" },
    { title: "Seminar", date: "2025-09-25" },
    { title: "Extra Event", date: "2025-09-24" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleScan = (decodedText) => {
    alert("QR Scanned: " + decodedText);
    setCameraOpen(false);
    scannerRef.current?.clear();
  };

  useEffect(() => {
    if (cameraOpen) {
      scannerRef.current = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      });
      scannerRef.current.render(handleScan, (err) => console.warn(err));
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [cameraOpen]);

  const openSubjectModal = (subject) => {
    setSelectedSubject(subject);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubject(null);
  };

  // Limit to latest 4 events
  const latestEvents = events.slice(0, 4);

  return (
    <div className="p-6 max-w-6xl mx-auto relative bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Welcome, Student!</h1>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Attendance Overview */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Subjects Attendance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {attendanceRecords.map((rec, idx) => {
            const radius = 16;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (rec.percentage / 100) * circumference;

            return (
              <motion.div
                key={idx}
                onClick={() => openSubjectModal(rec)}
                className="cursor-pointer bg-white border rounded-3xl shadow-lg p-6 text-center hover:shadow-2xl transition"
                whileHover={{ scale: 1.05 }}
              >
                {/* Circular progress */}
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      className="text-gray-300"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="transparent"
                      r={radius}
                      cx="18"
                      cy="18"
                    />
                    <circle
                      className={rec.percentage >= 75 ? "text-green-500" : "text-red-500"}
                      strokeWidth="4"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      fill="transparent"
                      r={radius}
                      cx="18"
                      cy="18"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {rec.percentage}%
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{rec.subject}</h3>
                <p className="text-gray-500 mt-1">
                  {rec.attended}/{rec.total} sessions
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Events */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recent Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {latestEvents.map((event, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold text-gray-800">{event.title}</h4>
                <p className="text-gray-500">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Scanner */}
      <div className="mb-10 text-center min-h-[300px]">
        {/* reserve space to prevent page shift */}
        <button
          onClick={() => setCameraOpen(!cameraOpen)}
          className="px-6 py-3 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition max-w-md mx-auto p-2 rounded-xl"
        >
          {cameraOpen ? "Close Camera" : "Open QR Scanner"}
        </button>
        {cameraOpen && (
          <div
            id="qr-reader"
            className="w-full max-w-md mx-auto mt-5 rounded-xl overflow-hidden shadow-lg"
          />
        )}
      </div>

      {/* Attendance Modal */}
      <AnimatePresence>
        {showModal && selectedSubject && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-4xl bg-white rounded-2xl shadow-2xl z-50 p-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <h2 className="text-3xl font-bold mb-6">{selectedSubject.subject} Attendance</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {selectedSubject.sessions.map((s, idx) => (
                  <li
                    key={idx}
                    className={`p-5 rounded-2xl text-center font-semibold shadow-lg transition ${
                      s.status === "Present"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <p className="text-lg">{s.date}</p>
                    <p className="text-lg">{s.status}</p>
                  </li>
                ))}
              </ul>
              <button
                onClick={closeModal}
                className="mt-6 w-full bg-blue-500 text-white rounded-full py-3 hover:bg-blue-600 transition"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
