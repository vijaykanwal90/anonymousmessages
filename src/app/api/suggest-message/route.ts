import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLEAI_API_KEY;
if (!API_KEY) {
  console.error("GOOGLEAI_API_KEY environment variable not set.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: Request) {
  try {
    const prompt = "Generate a list of three open-ended, lighthearted, and engaging questions formatted as a single string. Each question should be separated by '||'. The questions should be universally relatable, spark curiosity, and encourage fun, friendly conversations on an anonymous social messaging platform (like Qooh.me). Avoid personal, sensitive, or controversial topics. Focus instead on themes like hobbies, creativity, imagination, daily joys, and interesting 'what if' scenarios. Example output format: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'.";

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log("Generating suggested messages...");

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return Response.json({
      status: "success",
      message: "text generated successfully",
      data: text
    }, { status: 200 });

  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json({
      status: "false",
      message: "text can't be generated",
    }, { status: 500 });
  }
}
