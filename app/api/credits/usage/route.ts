import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const usage = await prisma.creditUsage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ usage });
  } catch (error: any) {
    console.error('Usage error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { creditsUsed, action, metadata } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.credits < creditsUsed) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Deduct credits and log usage in a transaction
    const [updatedUser, usage] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: {
            decrement: creditsUsed,
          },
        },
      }),
      prisma.creditUsage.create({
        data: {
          userId: user.id,
          creditsUsed,
          action,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      remainingCredits: updatedUser.credits,
      usage,
    });
  } catch (error: any) {
    console.error('Usage tracking error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
