import axios from "axios";
import React, { useState, useEffect } from "react";

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ngo, setNgo] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = token;
            setIsAuthenticated(true);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            setIsAuthenticated(false);
        }
    }, [token]);

    useEffect(() => {
        initializeAuth();
    }, []);

    async function initializeAuth() {
        setIsAuthLoading(true);
        try {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            const storedNgo = localStorage.getItem("ngo");

            if (storedToken && storedUser) {
                try {
                    const response = await axios.get(
                        "http://localhost:3001/api/auth/profile",
                        {
                            headers: {
                                Authorization: storedToken,
                            },
                        }
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
                    // Token verification failed
                    clearAuth();
                }
            }
        } catch (error) {
            // Auth initialization error
        } finally {
            setIsAuthLoading(false);
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
            console.error("Login error details:", error.response?.data); // Add this to see backend error
            return {
                success: false,
                message: "Login failed",
                error: error,
            };
        }
    }

    async function register(userData, isNgo = false) {
        try {
            const url = isNgo
                ? "http://localhost:3001/api/auth/register-ngo"
                : "http://localhost:3001/api/auth/register";

            console.log("Registration payload:", userData); // Add this to debug

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
            console.error("Registration error details:", error.response?.data); // Add this to see backend error

            return {
                success: false,
                message: "Registration failed",
                error: error,
            };
        }
    }

    async function logout() {
        try {
            if (token) {
                await axios.post("http://localhost:3001/api/auth/logout");
            }
        } catch (error) {
            // Logout error
        } finally {
            clearAuth();
        }
    }

    const value = {
        user,
        ngo,
        token,
        isAuthenticated,
        isAuthLoading,
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
