import { Message } from "@/models/User.model";
export interface ApiResponse {
 
  
  success: boolean;
  message:string;
  isAcceptingMessages?:boolean;
  messages?:Array<Message>;

}
export interface ApiResponseSuggestion extends ApiResponse{
  data : string
}
// type ApiResponse = ApiResponse | ApiResponseSuggestion;