import { Message } from "@/models/User.model";
export interface ApiResponse {
  [x: string]: any;
 
  
  success: boolean;
  message:string;
  isAcceptingMessages?:boolean;
  messages?:Array<Message>;

}