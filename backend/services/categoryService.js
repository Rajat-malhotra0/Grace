const Category = require("../models/category");

async function createCategory(data) {
    try {
        const category = new Category(data);
        await category.save();
        return category;
    } catch (error) {
        throw error;
    }
}

async function readCategories(filter = {}) {
    try {
        const categories = await Category.find(filter);
        return categories;
    } catch (error) {
        throw error;
    }
}

async function updateCategory(filter = {}, data = {}) {
    try {
        const category = await Category.findOneAndUpdate(filter, data, {
            new: true,
        });
        return category;
    } catch (error) {
        throw error;
    }
}

async function deleteCategory(filter = {}) {
    try {
        await Category.deleteOne(filter);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createCategory,
    readCategories,
    updateCategory,
    deleteCategory,
};
