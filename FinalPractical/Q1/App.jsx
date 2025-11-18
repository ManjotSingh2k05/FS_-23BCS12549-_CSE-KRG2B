import { useState } from "react";

export default function EmployeeList() {
  const employees = ["Abhey", "Aman", "Manjot", "Riya"];
  const [text, setText] = useState("");

  return (
    <div>
      <input 
        type="text" 
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <ol>
        {employees
          .filter(name => name.toLowerCase().startsWith(text.toLowerCase()))
          .map((name, i) => (
            <li key={i}>{name}</li>
          ))
        }
      </ol>
    </div>
  );
}
