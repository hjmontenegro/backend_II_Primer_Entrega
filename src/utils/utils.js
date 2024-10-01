import {fileURLToPath} from 'url'
import {dirname} from 'path'
import bcrypt from 'bcrypt'
import passport from 'passport'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

// Hashear la contraseña
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Validar la contraseña
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)


export const passportCall = (strategy, options = {}) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, options, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        if (info && info.name === 'TokenExpiredError') {
          //clear la cookie si el token esta expired
          res.clearCookie('jwt', { httpOnly: true, secure: false });
          return res.status(401).json({ message: 'Token expired' });
        } else if (info && info.name === 'NoAuthToken') {
          // No auth token pasa el error a next
          return next({ status: 401, message: 'No auth token' });
        }
        return next();
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

//getNextId para productos
import productsModel from "../models/products.model.js"; // Ajusta la ruta según la ubicación de tu modelo

export async function getNextId() {
  try {
    const lastProduct = await productsModel.findOne(
      {},
      {},
      { sort: { id: -1 } }
    );
    return lastProduct ? lastProduct.id + 1 : 1;
  } catch (error) {
    console.error("Error al obtener el siguiente ID:", error);
    throw error;
  }
}


import cartsModel from "../models/carts.model.js"; // Ajusta la ruta según la ubicación de tu modelo

//getNextId para carrito
export async function getNextIdC() {
  try {
    const lastCart = await cartsModel.findOne({}, {}, { sort: { id: -1 } });
    return lastCart ? lastCart.id + 1 : 1;
  } catch (error) {
    console.error("Error al obtener el siguiente ID:", error);
    throw error;
  }
}

//Helpers en handlebars
export const helpers = {
  eq: (a, b) => a == b,
  add: (a, b) => a + b,
};