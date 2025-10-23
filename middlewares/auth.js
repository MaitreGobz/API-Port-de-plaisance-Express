// Middleware to protect paths and id users

const jwt = require('jsonwebtoken');

function auth(req, res, next) {
     try {
        if (req.user && req.user.id) return next();

        const cookieToken = req.cookies?.token;
        if (cookieToken) {
            const payload = jwt.verify(cookieToken, process.env.JWT_SECRET);
            req.user = payload;
            return next();
        }

        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;
        if (!token) return res.status(401).json({ error: 'Token manquant' });

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        return next();
    } catch {
        return res.status(401).json({ error: 'Token invalide' });
    }
};

module.exports = { auth };