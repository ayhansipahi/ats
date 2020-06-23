const ID_TOKEN_KEY = "id_token";
import jwt from "jwt-decode";
export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const decodeToken = () => {
  const token = getToken();
  return jwt(token);
};

export const saveToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

export default { getToken, saveToken, destroyToken, decodeToken };
