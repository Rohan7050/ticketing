import {Subjects, Publisher, OrderCancelledEvent} from '@rpticketsproject/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}