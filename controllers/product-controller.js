import Product from "../models/Product.js";


export const getProduct = async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        return res.status(400).json({
            status: 400,
            message: "Please Enter a Product ID",
        })
    }
    else {
        try {
            const product = await Product.findOne({ _id: productId });
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: "Product Not Found",
                })
            }
            else {
                return res.status(200).json({
                    status: 200,
                    message: "Product Found",
                    product
                })
            }
        }
        catch (err) {
            console.log(err.message || err);
            return res.status(500).json({
                status: 500,
                message: "Unexpected Error Happened",
            })
        }
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const { categoryId } = req.query;

        const sanitizedPage = Math.max(1, page);
        const sanitizedLimit = Math.max(1, limit);

        // 2. Build the dynamic filter object
        const filter = {};
        if (categoryId) {
            filter.category = categoryId;
        }

        // 3. Calculate how many documents to skip
        const skip = (sanitizedPage - 1) * sanitizedLimit;

        // 4. Run database queries in parallel for efficiency
        const [products, totalProducts] = await Promise.all([
            Product.find(filter)
                .populate('category', 'name') // Optional: brings in category name
                .skip(skip)
                .limit(sanitizedLimit),
            Product.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalProducts / sanitizedLimit);

        if (sanitizedPage > totalPages && totalProducts > 0) {
            return res.status(404).json({
                status: 404,
                message: `Page ${sanitizedPage} does not exist. Total pages available: ${totalPages}`
            });
        }

        res.status(200).json({
            status: 200,
            message: products.length > 0 ? 'Products Found' : 'No products match your criteria',
            pagination: {
                totalProducts,
                totalPages,
                currentPage: sanitizedPage,
                limit: sanitizedLimit,
                hasNextPage: sanitizedPage < totalPages,
                hasPrevPage: sanitizedPage > 1
            },
            products
        });

    } catch (err) {
        console.error("Error fetching products:", err.message || err);
        res.status(500).json({
            status: 500,
            message: 'An unexpected error happened while fetching products.',
        });
    }
};

export const addProduct = async (req, res) => {
    let message;

    const { name, images, duration, price, description, options, categoryId } = req.body.productDetails || {};
    if (!categoryId) {
        return res.status(400).json({
            status: 400,
            message: "Please provide a category ID"
        });
    }
    try {
        const newProduct = await Product.create({
            name,
            images,
            duration,
            price,
            description,
            options,
            category: categoryId
        });

        message = {
            status: 201,
            message: "Product Added Successfully",
            product: newProduct
        };
    }
    catch (err) {
        message = {
            status: 500,
            message: "Unexpected Error Happened",
        };
        console.error("Error creating product:", err.message || err);
    }

    res.status(message.status).json(message);
};

export const updateProduct = async (req, res) => {
    let message;
    const { productId } = req.params;

    const { name, images, duration, price, description, options, categoryId } = req.body.productDetails || {};

    if (!productId) {
        message = {
            status: 400,
            message: "Please Enter a Product ID",
        };
    } else {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    name,
                    images,
                    duration,
                    price,
                    description,
                    options,
                    category: categoryId
                },
                { new: true, runValidators: true }
            );

            if (!updatedProduct) {
                message = {
                    status: 404,
                    message: "Product Not Found",
                };
            } else {
                message = {
                    status: 200,
                    message: "Product Updated Successfully",
                    product: updatedProduct
                };
            }
        } catch (err) {
            console.error("Error updating product:", err.message || err);
            message = {
                status: 500,
                message: "Unexpected Error Happened",
            };
        }
    }

    res.status(message.status).json(message);
};

export const deleteProduct = async (req, res) => {
    let message;
    const { productId } = req.params;
    if (!productId) {
        message = {
            status: 400,
            message: "Please Enter a Product ID",
        }
    }
    else {
        try {
            const deletedProduct = await Product.findByIdAndDelete(productId);
            if (!deletedProduct) {
                message = {
                    status: 404,
                    message: "Product Not Found",
                }
            }
            else {
                message = {
                    status: 200,
                    message: "Product Deleted Successfully",
                    product: deletedProduct
                }
            }
        }
        catch (err) {
            message = {
                status: 500,
                message: "Unexpected Error Happened",
            }
            console.log(err.message || err);
        }
    }
    res.status(message.status).json(message);
}