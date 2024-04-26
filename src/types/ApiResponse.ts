import { Message } from "@/app/models/User.model";
export interface ApiResponse {
  success: boolean;
  message:string;
  isAcceptingMessages?:boolean;
  messages?:Array<Message>;

}