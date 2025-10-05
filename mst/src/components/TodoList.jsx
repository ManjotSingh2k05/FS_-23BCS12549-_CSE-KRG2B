import React, { useState } from 'react'

function TodoList() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  const addTask = () => {
    if (task.trim() === '') return
    setTasks([...tasks, { text: task, completed: false }])
    setTask('')
  }

  const toggleComplete = (index) => {
    const newTasks = [...tasks]
    newTasks[index].completed = !newTasks[index].completed
    setTasks(newTasks)
  }

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index)
    setTasks(newTasks)
  }

  return (
    <div className="bg-white">
      <div className="flex mb-4">
        <input 
          type="text" 
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add new task"
          className="flex-1 border"
        />
        <button 
          onClick={addTask}
          className="bg-blue-1000  px-4 rounded-r"
        >
          Add
        </button>
      </div>
      <ul>
        {tasks.map((t, index) => (
          <li 
            key={index} 
            className="flex justify-between items-center mb-2"
          >
            <span 
              onClick={() => toggleComplete(index)}
              className={`cursor-pointer ${t.completed ? 'line-through' : ''}`}
            >
              {t.text}
            </span>
            <button 
              onClick={() => deleteTask(index)}
              className="text-red-500 hover"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
