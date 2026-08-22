import { NextResponse } from "next/server";
import { repondreChat } from "@/lib/chatbot";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body?.message ?? "").slice(0, 500);
    const reply = repondreChat(message);
    return NextResponse.json(reply);
  } catch {
    return NextResponse.json(
      {
        text: "Le chat est temporairement indisponible. Reessayez ou ecrivez a contact@mwconsulting.cm.",
        links: [{ label: "Aide", href: "/aide" }],
      },
      { status: 500 },
    );
  }
}
