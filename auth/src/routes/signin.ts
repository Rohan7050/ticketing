import express, { Request, Response } from "express";
import { validateRequest, BadRequestError } from "@rpticketsproject/common";
import { body } from "express-validator";
import { User } from "../models/userSchema";
import { Password } from "../services/password";
import jwt from "jsonwebtoken"

const router = express.Router();

router.post(
  "/api/users/signin",
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
    console.log(existingUser)
    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials!");
    }

    if (!await Password.compare(existingUser.password, password)) {
      throw new BadRequestError("Invalid Credentials!");
    }


    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    res.send({
      message: "success",
      data: existingUser,
    });
  }
);

export { router as signinUserRouter };
