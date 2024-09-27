import { Message } from "@/models/User.model";
export interface ApiResponse {
  data: any;
  split(arg0: string): unknown;
  success: boolean;
  message:string;
  isAcceptingMessages?:boolean;
  messages?:Array<Message>;

}