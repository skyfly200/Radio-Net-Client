import { Contact } from "@/models/contact";
import { Message } from "@/models/message";

export class Conversation {
  id: string = "";
  title: string = "";
  created: Date = new Date();
  creator: string = "";
  members: Array<Contact> = [];
  messages: Array<Message> = [];
  constructor(data: Conversation | {} = {}) {
    Object.assign(this, data);
  }
}
