import User from '../models/user.js';
import auth from '../firebase.js';


export const getUserById = async (req, res) => {
    let message;
    const { uid } = req.params;
    if (!uid) {
        message = {
            status: '400',
            message: 'User ID is required'
        }
        return res.status(400).json(message);
    }
    else {
        try {
            const user = await User.findOne({ id: uid });
            if (!user) {
                message = {
                    status: '404',
                    message: 'User ID Not Found'
                }
            }
            else {
                message = {
                    status: '200',
                    message: 'User Found',
                    user
                }
            }
        }
        catch (err) {
            message = {
                status: 500,
                message: 'An unexpected error happened.',
                error: err.message || err
            };
        }
    }
    return res.status(message.status).json(message);
}

export const getAllUsers = async (req, res) => {
    let message;
    try {
        const users = await User.find({});
        if (users.length === 0) {
            message = {
                status: '404',
                message: 'No users found'
            }
        }
        else {
            message = {
                status: '200',
                message: 'Users Found',
                users
            }
        }
    }
    catch (err) {
        message = {
            status: 500,
            message: 'An unexpected error happened.',
            error: err.message || err
        };
    }
    res.status(message.status).json(message);

}


export const deleteUser = async (req, res) => {
    const { uid } = req.params;

    if (!uid) {
        return res.status(400).json({
            status: 400,
            message: 'User ID is required'
        });
    }

    try {
        const user = await User.findOne({ id: uid });

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        await auth.revokeRefreshTokens(uid);
        await auth.deleteUser(uid);

        await User.deleteOne({ id: uid });

        return res.status(200).json({
            status: 200,
            message: 'User deleted successfully'
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            status: 500,
            message: 'Failed to delete user',
            error: err.message
        });
    }
};

