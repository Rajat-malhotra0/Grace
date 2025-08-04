import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

export const reportService = {
    // Create a new NGO report
    createReport: async (reportData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/ngo-reports`,
                reportData
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get reports for a specific NGO
    getReportsByNgo: async (ngoId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/ngo-reports?ngo=${ngoId}`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get all reports (with optional filters)
    getReports: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await axios.get(
                `${API_BASE_URL}/ngo-reports${
                    queryParams ? `?${queryParams}` : ""
                }`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get a specific report by ID
    getReportById: async (reportId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/ngo-reports/${reportId}`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Mark a report as resolved
    resolveReport: async (reportId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/ngo-reports/${reportId}/resolve`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default reportService;
