//Use this to add categories to the db

const mongoose = require("mongoose");
const Category = require("../models/category");
const connectDB = require("./connect");

const categories = [
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
];

async function addCategories() {
    try {
        await connectDB();

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
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
}

addCategories();
