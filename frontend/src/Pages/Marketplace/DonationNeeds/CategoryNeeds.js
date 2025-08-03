import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DonationNeedsPage from "./DonationNeedsPage";

const CategoryNeeds = () => {
    const { categoryTitle } = useParams();
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState({
        title: "",
        description: "",
    });

    // Map URL slugs to actual category names and display info
    const categoryMapping = {
        "food-nutrition": {
            apiName: "Food & Nutrition",
            displayName: "Food and Nutrition",
            description: "Essential food items and nutrition support",
        },
        clothing: {
            apiName: "Clothing & Apparel",
            displayName: "Clothing and Apparel",
            description: "Clean, wearable clothes for communities",
        },
        "books-stationery": {
            apiName: "Books & Stationery",
            displayName: "Books and Stationery",
            description: "Educational materials and school supplies",
        },
        "medical-supplies": {
            apiName: "Medical & Hygiene Supplies",
            displayName: "Medical and Hygiene Supplies",
            description: "Health essentials and sanitary products",
        },
        technology: {
            apiName: "Technology",
            displayName: "Technology Donations",
            description: "Digital devices and accessories",
        },
        furniture: {
            apiName: "Furniture & Essentials",
            displayName: "Furniture and Essentials",
            description: "Basic furniture and household items",
        },
        toys: {
            apiName: "Toys & Recreation",
            displayName: "Toys and Recreational Items",
            description: "Toys and games for children",
        },
        "skill-tools": {
            apiName: "Skill Tools",
            displayName: "Tools for Skill Building",
            description: "Tools for trades and skill development",
        },
        "other-items": {
            apiName: "Other Items",
            displayName: "Other Useful Items",
            description: "Additional useful items as per NGO needs",
        },
    };

    useEffect(() => {
        const fetchCategoryNeeds = async () => {
            try {
                setLoading(true);

                const categoryInfo = categoryMapping[categoryTitle];
                if (!categoryInfo) {
                    console.error("Invalid category slug:", categoryTitle);
                    setLoading(false);
                    return;
                }

                setCategoryInfo({
                    title: categoryInfo.displayName,
                    description: categoryInfo.description,
                });

                const response = await axios.get(
                    `http://localhost:3001/api/marketplace/category/${encodeURIComponent(
                        categoryInfo.apiName
                    )}`
                );

                const formattedData = response.data.map((item) => ({
                    id: item._id,
                    ngo: item.neededBy?.name || "Unknown NGO",
                    location: item.neededBy?.location || item.location,
                    item: item.name,
                    category: item.category,
                    quantity: item.quantity.toString(),
                    urgency: item.urgency,
                    datePosted: new Date(item.datePosted).toLocaleDateString(),
                    description: item.description,
                    neededTill: item.neededTill
                        ? new Date(item.neededTill).toLocaleDateString()
                        : null,
                    ngoImage: item.ngoImage || null, // No fallback to prevent 404 errors
                }));
                setCategoryData(formattedData);
            } catch (error) {
                console.error(`Error fetching ${categoryTitle} needs:`, error);
                setCategoryData([]);

                if (error.response) {
                    console.error("Response error:", error.response.data);
                    console.error("Status:", error.response.status);
                } else if (error.request) {
                    console.error("Request error:", error.request);
                } else {
                    console.error("Error:", error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (categoryTitle) {
            fetchCategoryNeeds();
        }
    }, [categoryTitle]);

    if (loading) {
        return (
            <div
                style={{
                    padding: "2rem",
                    textAlign: "center",
                    fontSize: "1.1rem",
                    color: "#666",
                }}
            >
                Loading {categoryInfo.title || "category"} needs...
            </div>
        );
    }

    if (!categoryMapping[categoryTitle]) {
        return (
            <div
                style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#d32f2f",
                }}
            >
                <h2>Category Not Found</h2>
                <p>The requested category "{categoryTitle}" does not exist.</p>
            </div>
        );
    }

    return (
        <DonationNeedsPage
            category={categoryInfo.title}
            categoryData={categoryData}
        />
    );
};

export default CategoryNeeds;
