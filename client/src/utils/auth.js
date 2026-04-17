export const getUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const isLoggedIn = () => Boolean(localStorage.getItem("token"));

export const saveAuth = (payload) => {
  localStorage.setItem("token", payload.token);
  localStorage.setItem("user", JSON.stringify(payload.user));
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
