import Together from "together-ai";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const together = new Together();

if (!process.env.TOGETHER_API_KEY) throw new Error("Missing Together env var");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ error: 'Please sign in to generate bios' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get user and check credits
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const creditsRequired = 1;
    if (user.credits < creditsRequired) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient credits',
          message: 'You need more credits to generate bios. Please purchase credits or subscribe to a plan.'
        }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, model } = await req.json();

    // Deduct credits and log usage
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: {
            decrement: creditsRequired,
          },
        },
      }),
      prisma.creditUsage.create({
        data: {
          userId: user.id,
          creditsUsed: creditsRequired,
          action: 'bio_generation',
          metadata: JSON.stringify({ model }),
        },
      }),
    ]);

    const runner = together.chat.completions.stream({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    return new Response(runner.toReadableStream());
  } catch (error: any) {
    console.error('Generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const runtime = "nodejs";
