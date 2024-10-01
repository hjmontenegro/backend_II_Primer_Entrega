import passport from 'passport';

// Chequear si el usuario está autenticado con JWT
export const isAuthenticated = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).send({ error: 'Not authorized. Needs to log in' });
        }
        req.user = user;  
        next();
    })(req, res, next);
};

// Chequear que el usuario no esté autenticado
export const isNotAuthenticated = (req, res, next) => {
    if (!req.cookies.jwt) {
        return next();
    } else {
        res.redirect('/profile');  
    }
};

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user)
            return res.status(401).send({ error: 'Unauthorized' });
        if (req.user.role !== role)
            return res.status(403).send({ error: 'No permissions' });
        next();
    }
}
