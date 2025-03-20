import axios from "axios";

const API_URL = "http://127.0.0.1:3000";

export const fetchData = async (table_name: string, db_type: string) => {
	const res = await axios.post(`${API_URL}/data`, { db_type, table_name });
	return res.data;
};

export const generateData = async (
	count: number,
	db_type: string,
	table_name: string,
	insert_into_many: boolean
) => {
	await axios.post(`${API_URL}/generate`, {
		count,
		db_type,
		table_name,
		insert_into_many,
	});
};

export const clearDatabase = async (db_type: string, table_name: string) => {
	await axios.post(`${API_URL}/clear`, { db_type, table_name });
};
