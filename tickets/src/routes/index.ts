import express, {Request, Response} from "express";
import { Ticket } from "../models/ticket";

const router  = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
    const ticketList = await Ticket.find({orderId: undefined});
    return res.status(200).send({message: "success", data: ticketList});
})

export {router as indexRouter};