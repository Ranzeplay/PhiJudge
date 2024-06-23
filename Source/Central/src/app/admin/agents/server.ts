'use server';

import { serverPrisma } from "@/lib/serverSidePrisma";

export async function AddNewAgent(name: string): Promise<string> {
	const agent = await serverPrisma.agent.create({
		data: {
			name: name
		}
	});

	return agent.id;
}
