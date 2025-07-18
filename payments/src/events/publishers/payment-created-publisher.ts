import { Subjects, Publisher, PaymentCreatedEvent } from "@rpticketsproject/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}