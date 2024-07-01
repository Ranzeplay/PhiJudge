'use server';

import { serverPrisma } from "@/lib/serverSidePrisma";

export async function UpdateLanguage(id: string, name: string, enabled: boolean) {
	await serverPrisma.availableProgrammingLanguage.update({
		where: { id },
		data: { name, enabled },
	});
}
