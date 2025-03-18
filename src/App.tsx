import React, { useState } from "react";
import Controls from "./components/Controls.tsx";

function App() {
  const [selectedTable, setSelectedTable] = useState("Employee");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Database Management</h1>
      <Controls selectedTable={selectedTable} setSelectedTable={setSelectedTable} />
    </div>
  );
}

export default App;