import { NextRequest, NextResponse } from "next/server";

export type AvailableLanguage = {
	id: string;
	name: string;
};

export function GET(_request: NextRequest) {
	return NextResponse.json([
		{ id: "c", name: "C" },
		{ id: "cpp", name: "C++" },
		{ id: "csharp", name: "C#" },
		{ id: "rust", name: "Rust" },
		{ id: "java", name: "Java" },
		{ id: "kotlin", name: "Kotlin" },
	]);
}
