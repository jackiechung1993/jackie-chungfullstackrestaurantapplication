import { useEffect, useContext } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";
import AppContext from "./context/AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Register a new user
export const registerUser = async (username, email, password) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const response = await axios.post(`${API_URL}/auth/local/register`, {
      username,
      email,
      password
    });
    Cookie.set("token", response.data.jwt);
    Router.push("/");
    return response.data;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

// Login
export const login = async (identifier, password) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const response = await axios.post(`${API_URL}/auth/local/`, {
      identifier,
      password
    });
    Cookie.set("token", response.data.jwt);
    Router.push("/");
    return response.data;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

// Logout
export const logout = () => {
  Cookie.remove("token");
  delete window.__user;
  window.localStorage.setItem("logout", Date.now());
  Router.push("/");
};

// Higher-order component for authentication
export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const { setUser, setIsAuthenticated } = useContext(AppContext);

    const syncLogout = (event) => {
      if (event.key === "logout") {
        Router.push("/login");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    useEffect(() => {
      const token = Cookie.get("token");
      if (token) {
        axios
          .get(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsAuthenticated(true);
            setUser(response.data);
          })
          .catch((error) => {
            console.error("Error fetching user data", error);
            setIsAuthenticated(false);
            setUser(null);
          });
      }
    }, [setIsAuthenticated, setUser]);

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Wrapper.getInitialProps = Component.getInitialProps;
  }

  return Wrapper;
};

