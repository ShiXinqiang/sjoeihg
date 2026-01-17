import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const records = await prisma.record.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  const body = await request.json();
  const record = await prisma.record.create({
    data: {
      subject: body.subject,
      duration: parseInt(body.duration),
      category: body.category,
    },
  });
  return NextResponse.json(record);
}
