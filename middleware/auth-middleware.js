import auth from '../firebase.js';

const verifyFirebaseAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: '401',
            message: 'Access Denied: No token provided'
        });
    }

    const idToken = authHeader.split(' ')[1];

    try {
        const isAdmin = await auth.verifyIdToken(idToken).then(claims => claims.admin === true);
        if (!isAdmin) {
            return res.status(403).json({
                status: '403',
                message: 'Access Denied: Admin privileges required'
            });
        }
        next();
    } catch (err) {
        console.error('Firebase Auth Error:', err.message);
        return res.status(401).json({
            status: '401',
            message: 'Invalid User: Token verification failed'
        });
    }
};

export default verifyFirebaseAdmin;