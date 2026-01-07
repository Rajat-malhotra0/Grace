import { toast } from "react-toastify";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { withApiBase } from "config";

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ngo, setNgo] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const clearAuth = useCallback(() => {
        setUser(null);
        setToken(null);
        setNgo(null);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("ngo");
        localStorage.removeItem("ngoRelationship");
        localStorage.removeItem("ngoName");

        delete axios.defaults.headers.common["Authorization"];
    }, []);

    const initializeAuth = useCallback(async () => {
        setIsAuthLoading(true);
        try {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            const storedNgo = localStorage.getItem("ngo");

            if (storedToken && storedUser) {
                try {
                    const response = await axios.get(
                        withApiBase("/api/auth/profile"),
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

                        if (
                            profile.user &&
                            profile.user.emailVerified !== undefined
                        ) {
                            updatedUser.emailVerified =
                                profile.user.emailVerified;
                        }

                        setIsAuthenticated(true);

                        if (profile.ngo && updatedUser.role?.includes("ngo")) {
                            setNgo(profile.ngo);
                            localStorage.setItem(
                                "ngo",
                                JSON.stringify(profile.ngo)
                            );
                        } else if (profile.associatedNgo || profile.ngoId) {
                            updatedUser.ngoId =
                                profile.associatedNgo?._id || profile.ngoId;
                            updatedUser.ngoName =
                                profile.associatedNgo?.name || null;
                        } else if (
                            storedNgo &&
                            updatedUser.role?.includes("ngo")
                        ) {
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
    }, [clearAuth]);

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
    }, [initializeAuth]);

    async function login(email, password) {
        try {
            const response = await axios.post(withApiBase("/api/auth/login"), {
                email,
                password,
            });

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
            } else {
                // Backend returned success: false
                 const msg = response.data.message || "Login failed";
                 toast.error(msg);
                return {
                    success: false,
                    message: msg,
                };
            }
        } catch (error) {
            console.error("Login error details:", error.response?.data);
            const errorMessage = error.response?.data?.message || error.message || "Login failed";
            toast.error(errorMessage);
            return {
                success: false,
                message: errorMessage,
                error: error,
            };
        }
    }

    async function register(userData, isNgo = false) {
        try {
            const url = isNgo
                ? withApiBase("/api/auth/register-ngo")
                : withApiBase("/api/auth/register");

            console.log("Registration URL:", url);
            console.log("Registration payload:", userData);

            const response = await axios.post(url, userData);
            console.log("Registration response:", response.data);

            if (response.data.success) {
                // DO NOT auto-login after registration
                // User must verify email and then login manually

                return {
                    success: true,
                    message:
                        "Registration successful! Please check your email to verify your account before logging in.",
                };
            }
        } catch (error) {
            console.error("Registration error details:", error);
            console.error("Error response:", error.response?.data);

            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
                error: error,
            };
        }
    }

    async function logout() {
        try {
            if (token) {
                await axios.post(withApiBase("/api/auth/logout"));
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
        isEmailVerified: user?.emailVerified || false,
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
