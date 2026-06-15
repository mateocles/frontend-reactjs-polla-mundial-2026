import api from "../axiosConfig";

export const AuthService = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((r) => r.data),

  register: (name, email, password) =>
    api.post("/auth/register", { name, email, password }).then((r) => r.data),

  updateProfile: (data) =>
    api.patch("/auth/profile", data).then((r) => r.data),

  google: (idToken) =>
    api.post("/auth/google", { idToken }).then((r) => r.data),
};
