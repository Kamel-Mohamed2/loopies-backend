import Product from "../models/Product.js";


export const getProduct = async (req, res) => {
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
            const product = await Product.findOne({ _id: productId });
            if (!product) {
                message = {
                    status: 404,
                    message: "Product Not Found",
                }
            }
            else {
                message = {
                    status: 200,
                    message: "Product Found",
                    product
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
    res.status(message.status).json({ message: message.message, product: message.product || null });
}

export const getAllProducts = async (req, res) => {
    let message;
    try {
        const products = await Product.find({});

        // Return 200 even if empty, because the database search successfully executed
        message = {
            status: 200, // Changed to a Number
            message: products.length > 0 ? 'Products Found' : 'No products available right now',
            products
        };
    }
    catch (err) {
        console.error("Error fetching all products:", err.message || err);
        message = {
            status: 500,
            message: 'An unexpected error happened.',
            error: err.message || err
        };
    }

    res.status(message.status).json(message);
};

export const addProduct = async (req, res) => {
    let message;

    const { name, images, duration, price, description, options } = req.body.productDetails || {};

    try {
        const newProduct = await Product.create({
            name,
            images,
            duration,
            price,
            description,
            options
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

    const { name, images, duration, price, description, options } = req.body.productDetails || {};

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
                    options
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