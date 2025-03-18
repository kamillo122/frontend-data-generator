import React from "react";

interface TableViewProps {
  data: any[];
  tableName: string;
}

const flattenObject = (obj: any, prefix = ""): any => {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {} as any);
};

const TableView: React.FC<TableViewProps> = ({ data, tableName }) => {
  if (data.length === 0) return <p className="text-center text-gray-600">No data available for {tableName}.</p>;

  const flatData = data.map((obj) => flattenObject(obj));
  
  const columns = Array.from(new Set(flatData.flatMap(Object.keys)));

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse border text-center border-gray-300">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th key="index">{tableName + ".id"}</th>
            {columns.map((key) => (
              <th key={key} className="p-3">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {flatData.map((row, index) => (
            <tr key={index} className="border-b border-gray-300 hover:bg-gray-100 transition">
              <td key="index">{index + 1}</td>
              {columns.map((col) => (
                <td key={col} className="p-3 text-gray-800">{String(row[col] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
