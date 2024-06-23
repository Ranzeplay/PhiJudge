"use server";

import { serverPrisma } from "@/lib/serverSidePrisma";
import { AgentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await serverPrisma.agent.update({
    where: {
      id: params.id,
    },
    data: {
      lastHeartbeat: new Date(),
      lastNetworkAddress: request.ip,
    },
  });

  if (result.status === AgentStatus.DISCONNECTED) {
    await serverPrisma.agent.update({
      where: {
        id: params.id,
      },
      data: {
        status: AgentStatus.AVAILABLE,
      },
    });
  }

  return NextResponse.json({ message: "Heartbeat received" });
}
