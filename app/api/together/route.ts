import Together from "together-ai";
import { platforms } from "../../components/PlatformDropDown";

const together = new Together();

if (!process.env.TOGETHER_API_KEY) throw new Error("Missing Together env var");

export async function POST(req: Request) {
  const { prompt, model, platform } = await req.json();
  
  // Get platform-specific character limit
  const selectedPlatform = platforms.find(p => p.name === platform);
  const charLimit = selectedPlatform?.charLimit || 300;
  
  // Create platform-specific prompt
  const enhancedPrompt = `Generate 3 ${prompt} 
  
  IMPORTANT REQUIREMENTS:
  - Each bio must be under ${charLimit} characters (including spaces)
  - Format for ${platform} platform
  - Clearly label as "1.", "2.", and "3."
  - No hashtags
  - Only return the 3 bios, nothing else
  ${platform === "LinkedIn" ? "- Use professional language appropriate for business networking" : ""}
  ${platform === "Instagram" ? "- Make them creative and visually appealing" : ""}
  ${platform === "TikTok" ? "- Keep them fun, catchy, and trendy" : ""}
  ${platform === "Facebook" ? "- Make them personal and relatable" : ""}
  ${platform === "Twitter/X" ? "- Make them engaging and conversation-starting" : ""}`;

  const runner = together.chat.completions.stream({
    model,
    messages: [{ role: "user", content: enhancedPrompt }],
    temperature: 0.7,
    max_tokens: 300,
  });

  return new Response(runner.toReadableStream());
}

export const runtime = "edge";
