class NgoReportService {
    async getAllReports(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (filters.ngo) queryParams.append("ngo", filters.ngo);
            if (filters.status) queryParams.append("status", filters.status);
            if (filters.category)
                queryParams.append("category", filters.category);
            if (filters.urgency) queryParams.append("urgency", filters.urgency);

            const response = await fetch(
                `http://localhost:3001/api/ngo-reports?${queryParams}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error fetching NGO reports:", error);
            throw error;
        }
    }

    async getReportById(reportId) {
        try {
            const response = await fetch(
                `http://localhost:3001/api/ngo-reports/${reportId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error fetching NGO report:", error);
            throw error;
        }
    }

    async createReport(reportData) {
        try {
            const response = await fetch(
                `http://localhost:3001/api/ngo-reports`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(reportData),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error creating NGO report:", error);
            throw error;
        }
    }

    async updateReport(reportId, updateData) {
        try {
            const response = await fetch(
                `http://localhost:3001/api/ngo-reports/${reportId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateData),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error updating NGO report:", error);
            throw error;
        }
    }

    async resolveReport(reportId) {
        try {
            const response = await fetch(
                `http://localhost:3001/api/ngo-reports/${reportId}/resolve`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error resolving NGO report:", error);
            throw error;
        }
    }

    async deleteReport(reportId) {
        try {
            const response = await fetch(
                `http://localhost:3001/api/ngo-reports/${reportId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error deleting NGO report:", error);
            throw error;
        }
    }
}

const ngoReportService = new NgoReportService();
export default ngoReportService;
