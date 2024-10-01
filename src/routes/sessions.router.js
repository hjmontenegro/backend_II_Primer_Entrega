import { Router } from 'express';
import jwt from 'jsonwebtoken';
import {createHash, isValidPassword, passportCall} from '../utils/utils.js'
import userModel from '../models/user.model.js';
import cartModel from '../models/carts.model.js'
import {authorization }  from '../middlewares/auth.js';
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const router = Router();

//registro
router.post('/register', async (req, res) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ errorMessage: 'This user already exists. Please, login' });
        }

        const newCart = await cartModel.create({ products: [] });  

        const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id  
        });

        await newUser.save();

        //creación del token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: "1h" }
          );
        
          //se guarda el token en la cookie      
          res.cookie("jwt", token, { httpOnly: true, secure: false });
          res.status(200).json({ message: "Register successful" });
        } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
});


//login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user || !isValidPassword(user, password)) {
      return res.status(401).json({ errorMessage: "Wrong credentials used for login." });
    }

    //generación del token
    let token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    //guardar el jwt en la cookie
    res.cookie("jwt", token, { httpOnly: true, secure: false });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ errorMessage: "Server error" });
  }
});


router.post('/logout', (req, res) => {
    try{
        res.clearCookie('jwt', { httpOnly: true, secure:false });
        res.status(200).json({ message: "Logout successful" });
      } catch (error) {
        res.status(500).json({ errorMessage: "Server error while logging out" });
      }
});

router.get('/current', passportCall('jwt'), authorization('user'),(req, res) => {        
    try {
        const user = req.user; 
        const cartId = user.cart; 
        res.json({ user, cartId });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user' });
    }
});

export default router;