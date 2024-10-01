import { Router } from 'express';
import userModel from '../models/user.model.js';
import mongoose from 'mongoose';

const router = Router();

router.get("/", async (req, res) => {
  try {
    let users = await userModel.find();
    res.send({ result: "success", payload: users });
  } catch (error) {
    res.status(500).send({ status: "Error", error: "Internal server error" });
  }
});

router.get("/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    if (!mongoose.Types.ObjectId.isValid(uid)) {
        return res.status(400).json({ error: "Invalid user ID. Enter a valid ID" });
      }
      let result = await userModel.findOne({_id:uid});
      if (!result) {
        return res.status(404).json({ error: "User not found" });
      }
      res.send({result: "success", payload: result});
      } catch (error) {
        console.error('Error while fetching the user', error);
        res.status(500).json({ error: 'Error while fetching product' });
        
      }
  });
  

router.put("/:uid", async (req, res) => {
    try {
      let uid = req.params.uid;

      let allowedFields = [
        "first_name",
        "last_name",
        "age",
      ];
  
      const updatedFields = {};
  
      for (const key in req.body) {
        if (key !== "id" && allowedFields.includes(key)) {
          updatedFields[key] = req.body[key];
        } else if (key !== "id") {
          return res
            .status(400)
            .json({ error: `Field '${key}' is not allowed for user update` });
        }
      }
      let user = await userModel.updateOne({_id:uid}, updatedFields)
      res.send({ result: "success", payload: user });
    } catch (error) {
      res.status(500).send({ result: "error", payload: error });
    }
  });

  router.delete("/:uid", async (req, res) => {
    try {
      let uid = req.params.uid;
      if (!mongoose.Types.ObjectId.isValid(uid)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
        let result = await userModel.deleteOne({_id:uid});
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.send({result: "success", payload: result});
  } catch (error) {
      console.error('Error while deleting the user', error);
      res.status(500).json({ error: 'Error while deleting user' });
  }
});
  




export default router;
