import nats from "node-nats-streaming";
import {TicketCreatedPublisher} from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "acb", { url: "http://localhost:4222" });

stan.on('connect', async () => {
    console.log("publisher connected to nats");

    // const data = JSON.stringify({
        // id: 20,
        // title: 'new test',
        // price: 30
    // });

    // stan.publish("ticket:created", data, () => {
    //     console.log("event published");
    // })

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: '20',
            title: 'new test',
            price: 30
        })
    }catch(err) {
        console.error(err);
    }
})