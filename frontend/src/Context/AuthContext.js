import axios from "axios";
import React, { useState, useEffect } from "react";

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ngo, setNgo] = useState(null); // Only for NGO owners
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        const profile = response.data.result;
                        setToken(storedToken);
                        let updatedUser = JSON.parse(storedUser);
                        setIsAuthenticated(true);

                        // Handle NGO data from profile - new logic
                        if (profile.ngo && updatedUser.role?.includes("ngo")) {
                            // User owns an NGO - store full NGO object
                            setNgo(profile.ngo);
                            localStorage.setItem(
                                "ngo",
                                JSON.stringify(profile.ngo)
                            );
                        } else if (profile.associatedNgo || profile.ngoId) {
                            // User is associated with an NGO - store only ID and name in user object
                            updatedUser.ngoId =
                                profile.associatedNgo?._id || profile.ngoId;
                            updatedUser.ngoName =
                                profile.associatedNgo?.name || null;
                        } else if (
                            storedNgo &&
                            updatedUser.role?.includes("ngo")
                        ) {
                            // Fallback: use stored NGO if user is NGO owner
                            setNgo(JSON.parse(storedNgo));
                        }

                        // Update user with NGO info if applicable
                        setUser(updatedUser);
                        localStorage.setItem(
                            "user",
                            JSON.stringify(updatedUser)
                        );

                        // Store relationship info if available
                        if (profile.ngoRelationship) {
                            localStorage.setItem(
                                "ngoRelationship",
                                JSON.stringify(profile.ngoRelationship)
                            );
                        }
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
        localStorage.removeItem("ngoRelationship");
        localStorage.removeItem("ngoName");

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
                    associatedNgo,
                    ngoRelationship,
                    ngoId,
                } = response.data.result;
                setToken(newToken);
                let updatedUser = userData;
                setIsAuthenticated(true);

                // Handle NGO data - new logic
                if (ngoData && userData.role?.includes("ngo")) {
                    // User owns an NGO - store full NGO object
                    setNgo(ngoData);
                    localStorage.setItem("ngo", JSON.stringify(ngoData));
                } else if (associatedNgo || ngoId) {
                    // User is associated with an NGO - store only ID and name in user object
                    updatedUser.ngoId = associatedNgo?._id || ngoId;
                    updatedUser.ngoName = associatedNgo?.name || null;
                }

                // Update user with NGO info if applicable
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));

                // Store relationship info if available
                if (ngoRelationship) {
                    localStorage.setItem(
                        "ngoRelationship",
                        JSON.stringify(ngoRelationship)
                    );
                }

                localStorage.setItem("token", newToken);

                return {
                    success: true,
                    user: updatedUser,
                    ngo: userData.role?.includes("ngo") ? ngoData : null,
                    ngoRelationship,
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
