export interface SQSMessage {
  MessageId?: string;

  ReceiptHandle?: string;

  MD5OfBody?: string;

  Body?: string;

  Attributes?: { [key: string]: string };

  MD5OfMessageAttributes?: string;

  MessageAttributes?: { [key: string]: string };
}
