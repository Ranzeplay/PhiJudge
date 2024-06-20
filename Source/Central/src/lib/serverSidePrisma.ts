import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
	return new PrismaClient()
}

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const serverPrisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = serverPrisma
