import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const fighters = await prisma.fighter.findMany();
  return NextResponse.json(fighters);
}

export async function POST(req: Request) {
  const data = await req.json();
  const fighter = await prisma.fighter.create({
    data: {
      name: data.name,
      weightClass: data.weightClass,
      ranking: data.ranking,
      pfpRanking: data.pfpRanking,
    },
  });
  return NextResponse.json(fighter);
}

export async function PUT(req: Request) {
  const data = await req.json();
  await prisma.fighter.update({
    where: { id: Number(data.id) },
    data : { ranking: data.ranking }
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.fighter.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}