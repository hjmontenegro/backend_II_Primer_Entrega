import passport from "passport";
import jwt from "passport-jwt";
import userService from '../../models/user.model.js';
import dotenv from "dotenv"

dotenv.config()

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {

    const cookieExtractor = (req) => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies.jwt; 
        }
        return token
    }

const options = {
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET
}
    passport.use('jwt', new JWTStrategy(options, async (jwt_payload, done) => {
        try {
            const user = await userService.findById(jwt_payload.id);
            if (!user) {
                return done(null, false, { message: 'User not found' });
              }
              return done(null, user);
            } catch (error) {
              return done(error, false);
            }
    }));

}

       

export default initializePassport