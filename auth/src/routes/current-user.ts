import express from "express";
import { currentUser } from "@rpticketsproject/common";
import { requireAuth } from "@rpticketsproject/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, requireAuth, (req, res) => {
  return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
