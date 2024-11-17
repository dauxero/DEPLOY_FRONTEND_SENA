import api from "./api";
import { getToken } from "./authService";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const token = getToken();
    const response = await api.get("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const addUser = async (userData: Omit<User, "_id">): Promise<User> => {
  try {
    const token = getToken();
    const response = await api.post("/api/users", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  try {
    const token = getToken();
    const response = await api.put(`/api/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const token = getToken();
    await api.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
