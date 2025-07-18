import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/userSchema";
import { BadRequestError, validateRequest } from "@rpticketsproject/common";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be between 4 to 20 chars"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("email already exists !");
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send({ message: "success", data: user });
  }
);

export { router as signupUserRouter };
