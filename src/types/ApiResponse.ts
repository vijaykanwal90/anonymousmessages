import { Message } from "@/models/User.model";
export interface ApiResponse {
  split(arg0: string): unknown;
  success: boolean;
  message:string;
  isAcceptingMessages?:boolean;
  messages?:Array<Message>;

}