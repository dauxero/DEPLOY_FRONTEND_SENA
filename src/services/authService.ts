import api from "./api";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/api/auth/login", {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getMe = async () => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};
