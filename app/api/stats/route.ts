import { NextResponse } from "next/server";
import { CausesStore, DonationsStore, MessagesStore, StatsStore } from "@/lib/data";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [causes, donations, messages, orgStats] = await Promise.all([
    CausesStore.getAll(),
    DonationsStore.getAll(),
    MessagesStore.getAll(),
    StatsStore.get(),
  ]);

  const totalCollected = causes.reduce((sum, c) => sum + c.raised, 0);
  const totalPeopleHelped = causes.reduce((sum, c) => sum + c.peopleHelped, 0);
  const activeCauses = causes.filter((c) => c.status === "active").length;
  const completedCauses = causes.filter((c) => c.status === "completed").length;

  return NextResponse.json({
    totalCollected,
    totalPeopleHelped,
    totalCauses: causes.length,
    activeCauses,
    completedCauses,
    totalDonations: donations.length,
    totalMessages: messages.length,
    volunteers: orgStats.volunteers,
    recentDonations: donations.slice(0, 6),
  });
}
