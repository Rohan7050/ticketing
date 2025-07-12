import {Subjects, Publisher, TicketUpdatedEvent} from "@rpticketsproject/common";

export class MyTicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}