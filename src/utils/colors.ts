export const getDepartmentColor = (department: string): string => {
	const colors: { [key: string]: string } = {
		HR: "#ff9800",
		IT: "#2196f3",
		Finance: "#4caf50",
		Sales: "#f44336",
	};
	return colors[department] || "#9e9e9e";
};
