export interface SendMessageResult {
  Id: string;
  MessageId: string;
  MD5OfMessageBody: string;
  MD5OfMessageAttributes?: string;
  MD5OfMessageSystemAttributes?: string;
  SequenceNumber?: string;
}
