const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_API_KEY);

// ...

// For text-only input, use the gemini-pro model

// ...

// export const runtime = 'edge'
export async function POST(req: Request) {
try {
      const prompt="Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

     
      // Ask OpenAI for a streaming chat completion given the prompt
const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      
    //   const generationConfig = {
    //     stopSequences: ["red"],
    //     maxOutputTokens: 200,
    //     temperature: 0.9,
    //     topP: 0.1,
    //     topK: 16,
    //   };
      
     
      
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // console.log(text);
        return Response.json({
            status:"success",
            message:"text generated successfully",
            data: text
        }, {status:200})

      
} catch (error) {
 
    
         console.error(" an unexpected error occured" , error);
         return Response.json({
            status:"success",
            message:"text generated successfully",
            
        }, {status:200

         })
    
}
}