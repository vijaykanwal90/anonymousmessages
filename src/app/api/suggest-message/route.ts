const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_API_KEY);

export async function POST(req: Request) {
try {
      const prompt="Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

     
      // Ask OpenAI for a streaming chat completion given the prompt
const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
      
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(typeof text)
    
        if(!response){
            return Response.json({
                status:"error",
                message:"unable to get response"
            },{status:404})
        }
        if(!result){
            return Response.json({
                status:"error",
                message:"error generating text"
            },{status:500})
        }
        return Response.json({
            status:"success",
            message:"text generated successfully",
            data: text
        }, {status:200})

      
} catch (error) {
 
    
         console.error(" an unexpected error occured" , error);
         return Response.json({
            status:"false",
            message:"text can't be  generated ",
            
        }, {status:404

         })
    
}
}




// import {  GoogleGenerativeAIProvider } from '@ai-sdk/google';
// import  { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import {LangugaeModelV1} from '@ai-sdk/google';
// // import { any } from 'zod';
// const apiKey = process.env.GOOGLEAI_API_KEY;
// export async function POST(req: Request){
//     try{
//       if(!apiKey){
//         throw new Error('api key is missing')
//       }

//       const genAI: GoogleGenerativeAIProvider = createGoogleGenerativeAI({
//         apiKey,
//       });
//        const model:LangugaeModelV1 = genAI.languageModel('gemini-pro');

// const prompt = "Write a story about a magic backpack.";

// const result = await model.generateContent({prompt:String});
// console.log(result.response.text());


//     }
//     catch(error){
//     }
// }