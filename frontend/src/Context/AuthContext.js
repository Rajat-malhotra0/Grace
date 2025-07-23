import axios from "axios";
import React, { useState, useEffect } from "react";

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ngo, setNgo] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = token;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    useEffect(() => {
        initializeAuth();
    }, []);

    async function initializeAuth() {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const storedNgo = localStorage.getItem("ngo");

        if (storedToken && storedUser) {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/auth/profile"
                );

                if (response.data.success) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    if (storedNgo) {
                        setNgo(JSON.parse(storedNgo));
                    }
                    setIsAuthenticated(true);
                } else {
                    clearAuth();
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                clearAuth();
            }
        } else {
            clearAuth();
        }
    }

    function clearAuth() {
        setUser(null);
        setToken(null);
        setNgo(null);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("ngo");

        delete axios.defaults.headers.common["Authorization"];
    }

    async function login(email, password) {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/auth/login",
                {
                    email,
                    password,
                }
            );

            if (response.data.success) {
                const {
                    token: newToken,
                    user: userData,
                    ngo: ngoData,
                } = response.data.result;
                setToken(newToken);
                setUser(userData);
                setIsAuthenticated(true);

                if (ngoData) {
                    setNgo(ngoData);
                    localStorage.setItem("ngo", JSON.stringify(ngoData));
                }
                localStorage.setItem("token", newToken);
                localStorage.setItem("user", JSON.stringify(userData));

                return {
                    success: true,
                    user: userData,
                    ngo: ngoData,
                };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: "Login failed",
            };
        }
    }

    async function register(userData, isNgo = false) {
        try {
            const url = isNgo
                ? "http://localhost:3001/api/auth/register-ngo"
                : "http://localhost:3001/api/auth/register";

            const response = await axios.post(url, userData);

            if (response.data.success) {
                const {
                    token: newToken,
                    user: newUser,
                    ngo: ngoData,
                } = response.data.result;

                setToken(newToken);
                setUser(newUser);
                setIsAuthenticated(true);

                if (ngoData) {
                    setNgo(ngoData);
                    localStorage.setItem("ngo", JSON.stringify(ngoData));
                }

                localStorage.setItem("token", newToken);
                localStorage.setItem("user", JSON.stringify(newUser));

                return {
                    success: true,
                    user: newUser,
                    ngo: ngoData,
                };
            }
        } catch (error) {
            console.error("Registration error:", error);
            return {
                success: false,
                message: "Registration failed",
            };
        }
    }

    async function logout() {
        try {
            if (token) {
                await axios.post("http://localhost:3001/api/auth/logout");
            }
        } catch (error) {
            console.log("Logout error: ", error);
        } finally {
            clearAuth();
        }
    }

    const value = {
        user,
        ngo,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        clearAuth,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export default AuthProvider;
