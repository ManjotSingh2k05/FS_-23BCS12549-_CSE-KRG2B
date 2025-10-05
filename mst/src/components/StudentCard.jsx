import React from 'react'

function StudentCard({ name, roll, course }) {
  return (
    <div className=" text-black p-6 shadow-lg text-center hover:bg-gray-300">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="mb-1">Roll Number: {roll}</p>
      <p>Course: {course}</p>
    </div>
  )
}

export default StudentCard
