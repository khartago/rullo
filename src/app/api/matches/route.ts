import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllMatches, updateMatchScore } from "@/lib/tournament";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const matches = await getAllMatches({
    categorySlug: searchParams.get("category") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });
  return NextResponse.json(matches);
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { matchId, ...data } = body;

  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }

  const updated = await updateMatchScore(matchId, data);

  revalidatePath("/", "layout");
  revalidatePath("/fr/tournament", "layout");
  revalidatePath("/en/tournament", "layout");

  return NextResponse.json(updated);
}
