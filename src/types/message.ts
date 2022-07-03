export enum MessageType {
  Success = 'success',
  Error = 'error',
}

export interface Message {
  text: string;
  type: MessageType;
}
