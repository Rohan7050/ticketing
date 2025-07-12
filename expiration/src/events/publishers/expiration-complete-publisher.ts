import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@rpticketsproject/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
