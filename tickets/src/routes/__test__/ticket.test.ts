import request from 'supertest';
import {app} from '../../app';
import {Ticket} from "../../models/ticket";

it('should implement optimistic concurrency control', async () => {
    const ticket = Ticket.build({
        title: 'new Ticket',
        price: 30,
        userId: "fdadawdawdawd"
    })
    await ticket.save();

    const fistInst = await Ticket.findById(ticket.id);
    const secInst = await Ticket.findById(ticket.id);

    fistInst!.set({
        price: 50
    });
    secInst!.set({
        price: 55
    });

    await fistInst!.save();

    try {
        await secInst!.save();
    }catch(e) {
        return;
    }

    throw new Error('shold not reach this point')
})

it("should increment ticket number multiple times", async () => {
    const ticket = Ticket.build({
        title: 'new Ticket',
        price: 30,
        userId: "fdadawdawdawd"
    })
    await ticket.save();
    expect(ticket.version).toEqual(0)
    await ticket.save();
    expect(ticket.version).toEqual(1)
    await ticket.save();
    expect(ticket.version).toEqual(2)
})