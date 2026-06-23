import auth from '../firebase.js';

const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 401,
            message: 'Access Denied: No token provided'
        });
    }

    const idToken = authHeader.split(' ')[1];

    try {
        const decodedToken = await auth.verifyIdToken(idToken, true);

        req.user = decodedToken;
        next();

    } catch (err) {
        console.error('Firebase Auth Error:', err.message);

        return res.status(401).json({
            status: 401,
            message: 'Invalid User: Token verification failed'
        });
    }
};

export default verifyFirebaseToken;