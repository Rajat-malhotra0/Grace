import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/volunteer-applications";

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
    };
};

// Apply for a volunteer opportunity
export const applyForVolunteer = async (ngoId, opportunityId, message = "") => {
    try {
        console.log("Applying with data:", { ngoId, opportunityId, message });
        const response = await axios.post(
            `${API_BASE_URL}/apply`,
            {
                ngoId,
                opportunityId,
                message,
            },
            {
                headers: getAuthHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        console.error("Apply for volunteer error:", error);
        console.error("Error response:", error.response?.data);
        throw (
            error.response?.data || {
                success: false,
                message: "Failed to submit application",
            }
        );
    }
};

// Get user's volunteer applications
export const getMyApplications = async (status = null) => {
    try {
        const url = status
            ? `${API_BASE_URL}/my-applications?status=${status}`
            : `${API_BASE_URL}/my-applications`;
        const response = await axios.get(url, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Get my applications error:", error);
        throw (
            error.response?.data || {
                success: false,
                message: "Failed to retrieve applications",
            }
        );
    }
};

// Check if user has applied for a specific opportunity
export const checkApplicationStatus = async (ngoId, opportunityId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/check/${ngoId}/${opportunityId}`,
            {
                headers: getAuthHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        console.error("Check application status error:", error);
        throw (
            error.response?.data || {
                success: false,
                message: "Failed to check application status",
            }
        );
    }
};

// Get applications for an NGO (NGO admin only)
export const getNgoApplications = async (ngoId, status = null) => {
    try {
        const url = status
            ? `${API_BASE_URL}/ngo/${ngoId}?status=${status}`
            : `${API_BASE_URL}/ngo/${ngoId}`;
        const response = await axios.get(url, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Get NGO applications error:", error);
        throw (
            error.response?.data || {
                success: false,
                message: "Failed to retrieve applications",
            }
        );
    }
};

// Update application status (NGO admin only)
export const updateApplicationStatus = async (applicationId, status) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/${applicationId}/status`,
            {
                status,
            },
            {
                headers: getAuthHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        console.error("Update application status error:", error);
        throw (
            error.response?.data || {
                success: false,
                message: "Failed to update application status",
            }
        );
    }
};
