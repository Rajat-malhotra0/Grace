//This file is being used to add categories of the NGOs into the db. 


const mongoose = require("mongoose");
const Category = require("../models/category");
const connectDB = require("./connect");

const categories = [
    // NGO Categories
    {
        name: "Education",
        description: "Supporting educational initiatives and literacy programs",
        type: "ngo",
    },
    {
        name: "Women Empowerment",
        description: "Promoting gender equality and women's rights",
        type: "ngo",
    },
    {
        name: "Health",
        description: "Healthcare services and medical assistance programs",
        type: "ngo",
    },
    {
        name: "Animal welfare",
        description: "Protection and care of animals",
        type: "ngo",
    },
    {
        name: "Environment",
        description: "Environmental conservation and sustainability projects",
        type: "ngo",
    },
    {
        name: "Rural Development",
        description: "Improving infrastructure and services in rural areas",
        type: "ngo",
    },
    {
        name: "Children",
        description: "Child welfare and development programs",
        type: "ngo",
    },

    // Marketplace Donation Categories
    {
        name: "Food & Nutrition",
        description: "Essential food items and nutrition support",
        type: "donation",
    },
    {
        name: "Clothing & Apparel",
        description: "Clean, wearable clothes for communities",
        type: "donation",
    },
    {
        name: "Books & Stationery",
        description: "Educational materials and school supplies",
        type: "donation",
    },
    {
        name: "Medical & Hygiene Supplies",
        description: "Health essentials and sanitary products",
        type: "donation",
    },
    {
        name: "Technology",
        description: "Digital devices and accessories",
        type: "donation",
    },
    {
        name: "Furniture & Essentials",
        description: "Basic furniture and household items",
        type: "donation",
    },
    {
        name: "Toys & Recreation",
        description: "Toys and games for children",
        type: "donation",
    },
    {
        name: "Skill Tools",
        description: "Tools for trades and skill development",
        type: "donation",
    },
    {
        name: "Other Items",
        description: "Additional useful items as per NGO needs",
        type: "donation",
    },
];

async function addCategories(keepConnectionOpen = false) {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }

        for (const categoryData of categories) {
            try {
                const existingCategory = await Category.findOne({
                    name: categoryData.name,
                    type: categoryData.type,
                });

                if (existingCategory) {
                    console.log(
                        `Category '${categoryData.name}' already exists`
                    );
                } else {
                    const category = new Category(categoryData);
                    await category.save();
                    console.log(
                        `Category '${categoryData.name}' added successfully`
                    );
                }
            } catch (error) {
                console.error(
                    `Error adding category '${categoryData.name}':`,
                    error.message
                );
            }
        }

        console.log("Category addition process completed");
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        throw error;
    } finally {
        if (!keepConnectionOpen) {
            await mongoose.connection.close();
            console.log("Database connection closed");
        }
    }
}

// Only run if this file is executed directly
if (require.main === module) {
    addCategories();
}

module.exports = { addCategories };
