import { useState } from "react";

export default function StudentsTab() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [studentsData, setStudentsData] = useState([
    {
      section: "A",
      students: [
        { id: 1, name: "Alice Johnson", email: "alice@college.com" },
        { id: 2, name: "Arjun Mehta", email: "arjun@college.com" },
      ],
    },
    {
      section: "B",
      students: [
        { id: 3, name: "Bina Patel", email: "bina@college.com" },
        { id: 4, name: "Ben Sharma", email: "ben@college.com" },
      ],
    },
    {
      section: "C",
      students: [
        { id: 5, name: "Charlie Singh", email: "charlie@college.com" },
        { id: 6, name: "Chloe Verma", email: "chloe@college.com" },
      ],
    },
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newSection, setNewSection] = useState("");

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAssignClick = (student, currentSection) => {
    setSelectedStudent({ ...student, currentSection });
    setNewSection(currentSection); 
  };

  const handleSectionChange = () => {
    if (!newSection || !selectedStudent) return;

    const updatedData = studentsData.map((sec) => {
      if (sec.section === selectedStudent.currentSection) {
        return {
          ...sec,
          students: sec.students.filter((s) => s.id !== selectedStudent.id),
        };
      }
      if (sec.section === newSection) {
        return {
          ...sec,
          students: [
            ...sec.students,
            { id: selectedStudent.id, name: selectedStudent.name, email: selectedStudent.email },
          ],
        };
      }
      return sec;
    });

    setStudentsData(updatedData);

    setSelectedStudent(null);
    setNewSection("");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Students by Section</h2>

      {studentsData.map((sec) => (
        <div key={sec.section} className="mb-4 border-b pb-2">
          <button
            className="w-full flex justify-between items-center text-left px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            onClick={() => toggleSection(sec.section)}
          >
            <span className="font-medium text-gray-700">Section {sec.section}</span>
            <span>{expandedSection === sec.section ? "▲" : "▼"}</span>
          </button>

          {expandedSection === sec.section && (
            <div className="mt-2 pl-4">
              {sec.students.map((student) => (
                <div
                  key={student.id}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <button
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleAssignClick(student, sec.section)}
                  >
                    Change Section
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h3 className="text-lg font-semibold mb-3">
              Change Section for {selectedStudent.name}
            </h3>
            <select
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="">Select new section</option>
              {studentsData.map((sec) => (
                <option key={sec.section} value={sec.section}>
                  {sec.section}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setSelectedStudent(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleSectionChange}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
