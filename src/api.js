const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function fetchStudentByRollNo(rollNo) {
  const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(rollNo)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch student");
  return data;
}
