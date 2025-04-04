const prisma = require('../prisma/client');

const authMiddleware = async (req, res, next) => {
    try {
        // ... JWT verification logic ...
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.userId }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
}; 