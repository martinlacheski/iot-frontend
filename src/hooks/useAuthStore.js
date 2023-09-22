import { useDispatch, useSelector } from "react-redux";
import { iotApi } from "../api";
import { onChecking, onLogin, onLogout, clearErrorMessage } from "../store";

export const useAuthStore = () => {
  const { status, user, role, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startLogin = async ({ email, password }) => {
    dispatch(onChecking());
    try {
      const { data } = await iotApi.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid, role: data.role }));
    } catch (error) {
      if (error.response.data?.msg) {
        dispatch(onLogout(error.response.data?.msg));
      } else {
        dispatch(onLogout("Verifique las credenciales ingresadas."));
      }
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const startRegister = async ({ name, email, password }) => {
    dispatch(onChecking());
    try {
      const { data } = await iotApi.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid, role: data.role }));
    } catch (error) {
      if (error.response.data?.msg) {
        dispatch(onLogout(error.response.data?.msg));
      } else {
        dispatch(onLogout("Verifique los campos ingresados."));
      }
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout());

    try {
      const { data } = await iotApi.get("/auth/renew");
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid, role: data.role }));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout());
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
  };

  return {
    // Propiedades
    status,
    user,
    role,
    errorMessage,

    // Métodos
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout,
  };
};
