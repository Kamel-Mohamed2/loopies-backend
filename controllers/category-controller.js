import Category from "../models/Category.js";

export const getCategory = async (req, res) => {
    let message;
    const { categoryId } = req.params;
    if (!categoryId) {
        message = {
            status: 400,
            message: "Please Enter Category ID"
        }
    }
    else {
        try {
            const category = await Category.findById(categoryId)
            if (!category) {
                message = {
                    status: 404,
                    message: "Category Not Found"
                }
            }
            else {
                message = {
                    status: 200,
                    message: "Category Found",
                    category
                }
            }
        }
        catch (err) {
            console.error(err.message || err)
            message = {
                status: 500,
                message: "Unexpected Error Happened"
            }
        }
    }
    res.status(message.status).json(message);
}

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        if (!categories || categories.length < 1) {
            return res.status(404).json({
                status: 404,
                message: "No Categories Found"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Categories Found",
            categories
        });

    } catch (err) {
        console.error(err.message || err);

        return res.status(500).json({
            status: 500,
            message: "Unexpected System Error Happened"
        });
    }
};

export const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name, images } = req.body.categoryDetails || {};

    if (!categoryId) {
        return res.status(400).json({
            status: 400,
            message: "Please Enter Category ID"
        });
    }

    try {
        const updates = {};

        if (name !== undefined) updates.name = name;
        if (images !== undefined) updates.images = images;

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                status: 404,
                message: "Category Not Found"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Category Updated",
            category: updatedCategory
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            status: 500,
            message: "Unexpected System Error Happened"
        });
    }
};

export const addCategory = async (req, res) => {
    const { name, images } = req.body.categoryDetails || {};
    if (!name || !images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
            status: 400,
            message: "Please provide valid category details"
        });
    }
    else {
        try {
            const newCategory = new Category({
                name,
                images
            });
            await newCategory.save();
            return res.status(201).json({
                status: 201,
                message: "Category Created",
                category: newCategory
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 500,
                message: "Unexpected System Error Happened"
            });
        }
    }
}