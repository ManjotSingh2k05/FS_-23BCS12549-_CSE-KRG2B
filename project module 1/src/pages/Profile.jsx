import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";

const Profile = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const qrRef = useRef(null);

  const subjects = [
    { name: "Mathematics", attendance: "85%" },
    { name: "Physics", attendance: "92%" },
    { name: "Computer Science", attendance: "78%" },
    { name: "Mechanical", attendance: "56%" },
  ];

  const events = [
    { name: "Tech Fest", date: "2025-09-10" },
    { name: "Guest Lecture: AI", date: "2025-09-15" },
    { name: "Sports Day", date: "2025-09-20" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleScanner = () => {
    setShowScanner((prev) => {
      if (prev && qrRef.current?.video) {
        const stream = qrRef.current.video.srcObject;
        if (stream) stream.getTracks().forEach((track) => track.stop());
      }
      return !prev;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Attendance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {subjects.map((sub, idx) => (
              <div key={idx} className="bg-blue-100 p-4 rounded">
                <p className="font-semibold">{sub.name}</p>
                <p className="text-gray-700">Attendance: {sub.attendance}</p>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Recent Events Attended</h2>
          <ul className="list-disc list-inside">
            {events.map((ev, idx) => (
              <li key={idx}>
                {ev.name} - <span className="text-gray-600">{ev.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {}
        <div>
          <button
            onClick={toggleScanner}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
          >
            {showScanner ? "Close QR Scanner" : "Scan QR for Attendance"}
          </button>

          {showScanner && (
            <div className="mt-4">
              <QrReader
                ref={qrRef}
                onResult={(result, error) => {
                  if (!!result) setScanResult(result?.text);
                }}
                constraints={{ facingMode: "environment" }}
                style={{ width: "100%" }}
              />
              {scanResult && (
                <p className="mt-2 text-green-700 font-semibold">
                  QR Scanned: {scanResult}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
