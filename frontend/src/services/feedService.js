import { withApiBase } from "config";

const API_BASE_URL = withApiBase("/api");

class FeedService {
    async getAllPosts(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (filters.user) queryParams.append("user", filters.user);
            if (filters.category)
                queryParams.append("category", filters.category);

            const response = await fetch(
                `${API_BASE_URL}/feed?${queryParams}`,
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
            console.error("Error fetching posts:", error);
            throw error;
        }
    }

    async getPostById(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/feed/${postId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error fetching post:", error);
            throw error;
        }
    }

    async createPost(postData) {
        try {
            const response = await fetch(`${API_BASE_URL}/feed/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    }

    async uploadPost(file, postData) {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("user", postData.user);
            formData.append("caption", postData.caption);
            formData.append("size", postData.size || "medium");
            if (postData.tags) {
                formData.append("tags", JSON.stringify(postData.tags));
            }

            const response = await fetch(`${API_BASE_URL}/feed/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error uploading post:", error);
            throw error;
        }
    }

    async updatePost(postId, updateData) {
        try {
            const response = await fetch(`${API_BASE_URL}/feed/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    }

    async deletePost(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/feed/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    }

    async likePost(postId, userId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/feed/${postId}/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error liking post:", error);
            throw error;
        }
    }

    async unlikePost(postId, userId) {
        // Since the backend toggles likes, we use the same endpoint
        return this.likePost(postId, userId);
    }

    async addComment(postId, userId, text) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/feed/${postId}/comment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId, text }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error adding comment:", error);
            throw error;
        }
    }

    async sharePost(postId, userId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/feed/${postId}/share`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error sharing post:", error);
            throw error;
        }
    }
}

const feedService = new FeedService();
export default feedService;
