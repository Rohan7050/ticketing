import {Subjects, Publisher, TicketCreatedEvent} from "@rpticketsproject/common";

export class MyTicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}