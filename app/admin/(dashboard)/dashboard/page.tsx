import { CausesStore, DonationsStore, MessagesStore, StatsStore } from "@/lib/data";

export const dynamic = "force-dynamic";

function formatMYR(n: number) {
  return `RM ${n.toLocaleString("en-MY")}`;
}

export default async function AdminDashboardPage() {
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

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-1">Dashboard</h1>
      <p className="text-ink/50 text-sm mb-8">
        Overview of donations, families helped, and platform activity.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard label="Total Amount Collected" value={formatMYR(totalCollected)} accent="pink" />
        <StatCard label="People & Families Helped" value={totalPeopleHelped.toLocaleString("en-MY")} accent="blue" />
        <StatCard label="Active Causes" value={String(activeCauses)} accent="blue" />
        <StatCard label="Completed Causes" value={String(completedCauses)} accent="pink" />
        <StatCard label="Total Donations Received" value={String(donations.length)} accent="blue" />
        <StatCard label="Volunteers" value={String(orgStats.volunteers)} accent="pink" />
        <StatCard label="Contact Messages" value={String(messages.length)} accent="blue" />
        <StatCard label="Total Causes Listed" value={String(causes.length)} accent="pink" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/10 rounded-2xl p-6">
          <h2 className="font-display text-xl text-ink mb-4">Recent Donations</h2>
          {donations.length === 0 ? (
            <p className="text-sm text-ink/40">No donations recorded yet.</p>
          ) : (
            <ul className="divide-y divide-ink/5">
              {donations.slice(0, 6).map((d) => (
                <li key={d.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-ink">{d.name}</p>
                    <p className="text-xs text-ink/45">{d.causeTitle}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {formatMYR(d.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl p-6">
          <h2 className="font-display text-xl text-ink mb-4">Recent Messages</h2>
          {messages.length === 0 ? (
            <p className="text-sm text-ink/40">No messages received yet.</p>
          ) : (
            <ul className="divide-y divide-ink/5">
              {messages.slice(0, 6).map((m) => (
                <li key={m.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-ink">{m.name}</p>
                    <p className="text-xs text-ink/40">
                      {new Date(m.createdAt).toLocaleDateString("en-MY")}
                    </p>
                  </div>
                  <p className="text-xs text-ink/50 truncate">{m.subject}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "blue" | "pink";
}) {
  return (
    <div className="bg-white border border-ink/10 rounded-2xl p-5">
      <p className="text-xs text-ink/45 mb-2">{label}</p>
      <p
        className={`font-display text-2xl ${
          accent === "pink" ? "text-pink-500" : "text-blue-600"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
