import React, { useState, useEffect } from "react";
import { fetchData, clearDatabase, generateData } from "../service/api.ts";
import TableView from "./TableView.tsx";
import { flattenObject } from '../utils/utils';

const tables = ["Address", "Client", "Contract", "Employee", "Payment", "Project", "Task", "Technology"];


const Controls = ({ selectedTable, setSelectedTable }) => {
  const [dbType, setDbType] = useState("mysql");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [rowCount, setRowCount] = useState(10);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [generateAll, setGenerateAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTableData();
  }, [dbType, selectedTable]);

  const fetchTableData = async () => {
    setLoading(true);
    setGenerationTime(null);
    try {
      const response = await fetchData(selectedTable.toLowerCase(), dbType);
      setData(response);
    } catch (err) {
      console.error(err);
      setData([]);
    }
    setLoading(false);
  };

  const handleClear = async () => {
    setClearing(true);
    setGenerationTime(null);
    try {
      await clearDatabase(dbType, selectedTable.toLowerCase());
      setData([]);
    } catch (err) {
      console.error(err);
    }
    setClearing(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationTime(null);
    const startTime = performance.now();
    try {
      await generateData(rowCount, dbType, selectedTable.toLowerCase(), generateAll);
      fetchTableData();
    } catch (err) {
      console.error(err);
    }
    const endTime = performance.now();
    setGenerationTime(endTime - startTime);
    setGenerating(false);
  };

  const handleExport = () => {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }
    const csvContent = [
      Object.keys(flattenObject(data[0])).join(","),
      ...data.map(row => Object.values(flattenObject(row)).map(value => `"${value}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTable}_export.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value => {
      if (typeof value === "object") {
        return Object.values(value).some(innerValue => innerValue.toString().toLowerCase().includes(searchQuery.toLowerCase()));
      } else {
        return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
      }
    }
    )
  );

  return (
    <div className="flex flex-col items-center space-y-4 mb-6 p-4 border rounded-lg shadow-lg">
      <div className="flex flex-col space-y-2 w-full">
        <label className="font-semibold">Select Table:</label>
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="p-2 border rounded-lg w-full"
        >
          {tables.map((table) => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-2 w-full">
        <label className="font-semibold">Select Database Type:</label>
        <select
          value={dbType}
          onChange={(e) => setDbType(e.target.value.toLowerCase())}
          className="p-2 border rounded-lg w-full"
        >
          <option value="mysql">MySQL</option>
          <option value="mongodb">MongoDB</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div className="flex flex-col space-y-2 w-full">
        <label className="font-semibold">Number of Rows to Generate:</label>
        <input
          type="number"
          value={rowCount}
          onChange={(e) => setRowCount(Number(e.target.value))}
          className="p-2 border rounded-lg w-full"
        />
      </div>

      <div className="flex items-center space-x-2 w-full">
      <label className="font-semibold">Generate data for all tables:</label>
        <input
          type="checkbox"
          checked={generateAll}
          onChange={() => setGenerateAll(!generateAll)}
        />
      </div>

      <div className="flex flex-col space-y-2 w-full">
        <label className="font-semibold">Search:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-lg w-full"
          placeholder="Search data..."
        />
      </div>

      {generationTime !== null && (
        <div className="text-sm text-gray-700 mt-2">
          Data generation took {generationTime.toFixed(2)} milliseconds.
        </div>
      )}

      <div className="flex gap-2 w-full">
        <button
          onClick={handleClear}
          className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
          disabled={clearing}
        >
          {clearing ? "Clearing..." : "Clear Database"}
        </button>
        <button
          onClick={handleGenerate}
          className="flex-1 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
          disabled={generating}
        >
          {generating ? "Generating..." : "Generate Data"}
        </button>
        <button
    onClick={handleExport}
    className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
  >
    Export Data
  </button>
      </div>

      <TableView data={filteredData} tableName={selectedTable} />
    </div>
  );
};

export default Controls;