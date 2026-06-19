import Category from "../models/Category";

export const getCategory = async (req , res) => {
    let message;
    const {categoryId} = req.params;
    if(!categoryId)
    {
        message = {
            status : 400,
            message : "Please Enter Category ID"
        }
    }
    else {
        try {
            const category = Category.findById(categoryId)
            if(!category)
            {
                message = { 
                    status : 404,
                    message : "Category Not Found"
                }
            }
            else {
                message = { 
                    status : 200,
                    message : "Category Found",
                    category
                }
            }
        }
        catch(err) {
            console.error(err.message || err)
            message = {
                status : 500,
                message : "Unexpected Error Happened"
            }
        }
    }
    res.status(message.status).json(message);
}

export const getAllCategories = async (req , res) => {

}

export const updateCategory  = async (req , res) => {

}

export const addCategory = async (req , res) => {

}