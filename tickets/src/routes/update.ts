import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@rpticketsproject/common";
import { body } from "express-validator";
import { MyTicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").optional().not().isEmpty().withMessage("title is required."),
    body("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { title, price } = req.body;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (ticket.orderId) {
      throw new BadRequestError(
        "Ticket is reserved, can not edit a reserved ticket"
      );
    }
    ticket.title = title ? title : ticket.title;
    ticket.price = price ? price : ticket.price;
    await ticket.save();
    await new MyTicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    return res.status(200).json({ message: "success", data: ticket });
  }
);

export { router as updateRouter };
