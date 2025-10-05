import React from 'react'
import TodoList from './components/TodoList'
import StudentCard from './components/StudentCard'

function App() {
  const students = [
    { name: 'Manjot', roll: '101', course: 'Math' },
    { name: 'Priyanshu', roll: '102', course: 'Physics' },
    { name: 'Jagnesh', roll: '103', course: 'Chemistry' },
    { name: 'Pl', roll: '104', course: 'Biology' },
  ]

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center ">Practical MST</h1>

      {}
      <section className="">
        <h2 className="text-2xl">Todo List</h2>
        <TodoList />
      </section>

      <section>
        <h2 className="text-2xl">Student Info Cards</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">

          {}
          {students.map((s, index) => (
            <StudentCard 
              key={s.roll}
              name={s.name}
              roll={s.roll}
              course={s.course}
            />
          ))}
        </div>
      </section>

    </div>
  )
}

export default App
