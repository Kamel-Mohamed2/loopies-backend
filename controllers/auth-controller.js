import User from '../models/user.js';
import auth from '../firebase.js';

export const signUp = async (req, res) => {
    const { user } = req.user;
    const { uid } = user;
    let message;

    try {
        const existingUser = await User.findOne({ id: uid });
        if (existingUser) {
            message = 'User already exists';
            return res.status(400).json({ message });
        } else {
            try {
                const newUser = new User({
                    id: uid,
                    email: user.email,
                    name: user.name
                });
                await newUser.save();
            } catch (err) {
                message = 'Error creating user';
                return res.status(500).json({ message });
            }
            return res.status(201).json({ message: 'User created successfully' });
        }
    }
    catch (err) {
        message = 'Internal server error';
        return res.status(500).json({ message });
    }

}

export const signIn = async (req, res) => {
    let message;
    const { user } = req.user;
    const { uid } = user;
    const userData = await User.findOne({ id: uid });


    if (!userData) {
        message = {
            status: 404,
            message: 'User not found'
        }
        return res.status(404).json(message);
    }
    else {
        message = {
            status: 200,
            message: 'User found',
            userData
        }
        return res.status(200).json(message);
    }

}

export const signOut = async (req, res) => {
    try {
        const uid = req.user.uid;

        await auth.revokeRefreshTokens(uid);

        const userRecord = await auth.getUser(uid);
        const revocationValidAfterTime = new Date(userRecord.tokensValidAfterTime).getTime() / 1000;

        return res.status(200).json({
            status: 200,
            message: 'Successfully signed out. Session revoked.',
            revocationTime: revocationValidAfterTime
        });
    } catch (err) {
        console.error('Sign out error:', err.message);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error during sign out'
        });
    }
};



