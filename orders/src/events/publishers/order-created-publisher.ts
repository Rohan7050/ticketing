import {Subjects, Publisher, OrderCreatedEvent} from '@rpticketsproject/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}