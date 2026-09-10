"use client";

import { useEffect, useState } from "react";
import type { Cause } from "@/lib/data";

const emptyForm = {
  title: "",
  category: "",
  tags: "",
  summary: "",
  description: "",
  image: "",
  goal: "",
  raised: "",
  peopleHelped: "",
  priority: false,
  status: "active" as "active" | "completed",
  location: "",
};

function formatMYR(n: number) {
  return `RM ${n.toLocaleString("en-MY")}`;
}

export default function AdminCausesManager() {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadCauses() {
    setLoading(true);
    const res = await fetch("/api/causes");
    const data = await res.json();
    setCauses(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCauses();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setModalOpen(true);
  }

  function openEdit(cause: Cause) {
    setEditingId(cause.id);
    setForm({
      title: cause.title,
      category: cause.category,
      tags: cause.tags.join(", "),
      summary: cause.summary,
      description: cause.description,
      image: cause.image,
      goal: String(cause.goal),
      raised: String(cause.raised),
      peopleHelped: String(cause.peopleHelped),
      priority: cause.priority,
      status: cause.status,
      location: cause.location,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this cause? This cannot be undone.")) return;
    const res = await fetch(`/api/causes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCauses((prev) => prev.filter((c) => c.id !== id));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { ...form };

    try {
      const res = await fetch(
        editingId ? `/api/causes/${editingId}` : "/api/causes",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save cause.");
      setModalOpen(false);
      await loadCauses();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink mb-1">Manage Causes</h1>
          <p className="text-ink/50 text-sm">
            Add, edit, or remove families and causes shown on the website.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors focus-ring"
        >
          + Add Cause
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-ink/40">Loading causes...</p>
      ) : causes.length === 0 ? (
        <p className="text-sm text-ink/40">No causes yet. Add your first one.</p>
      ) : (
        <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-ink/45">
                <th className="p-4 font-medium">Cause</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Raised / Goal</th>
                <th className="p-4 font-medium">People Helped</th>
                <th className="p-4 font-medium">Priority</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {causes.map((cause) => (
                <tr key={cause.id} className="border-b border-ink/5 last:border-none">
                  <td className="p-4 font-medium text-ink max-w-[240px]">{cause.title}</td>
                  <td className="p-4 text-ink/60">{cause.category}</td>
                  <td className="p-4 text-ink/60">
                    {formatMYR(cause.raised)} / {formatMYR(cause.goal)}
                  </td>
                  <td className="p-4 text-ink/60">{cause.peopleHelped}</td>
                  <td className="p-4">
                    {cause.priority ? (
                      <span className="text-xs font-semibold text-pink-500 bg-pink-50 px-2.5 py-1 rounded-full">
                        Top Priority
                      </span>
                    ) : (
                      <span className="text-xs text-ink/30">&mdash;</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        cause.status === "active"
                          ? "text-blue-600 bg-blue-50"
                          : "text-ink/50 bg-ink/5"
                      }`}
                    >
                      {cause.status === "active" ? "Active" : "Completed"}
                    </span>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(cause)}
                      className="text-blue-600 font-semibold text-xs mr-4 hover:underline underline-offset-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cause.id)}
                      className="text-pink-500 font-semibold text-xs hover:underline underline-offset-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-7 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-ink">
                  {editingId ? "Edit Cause" : "Add New Cause"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-ink/40 hover:text-ink text-xl leading-none"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <TextField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
                  <TextField label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} required placeholder="e.g. Single Mothers" />
                </div>

                <TextField label="Tags (comma-separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="Children, Education" />

                <TextField label="Short Summary" value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} required />

                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">
                    Full Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm focus-ring focus:border-blue-400 outline-none resize-none"
                  />
                </div>

                <TextField label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="https://..." />

                <div className="grid sm:grid-cols-3 gap-4">
                  <TextField label="Goal (RM)" type="number" value={form.goal} onChange={(v) => setForm({ ...form, goal: v })} required />
                  <TextField label="Raised (RM)" type="number" value={form.raised} onChange={(v) => setForm({ ...form, raised: v })} />
                  <TextField label="People Helped" type="number" value={form.peopleHelped} onChange={(v) => setForm({ ...form, peopleHelped: v })} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <TextField label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="e.g. Kelantan" />
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1.5">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "completed" })}
                      className="w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm focus-ring focus:border-blue-400 outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 text-sm text-ink/70">
                  <input
                    type="checkbox"
                    checked={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.checked })}
                    className="w-4 h-4 rounded accent-pink-500"
                  />
                  Mark as Top Priority (shown on homepage)
                </label>

                {error && <p className="text-sm text-pink-600">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 border border-ink/15 text-ink/70 font-semibold py-3 rounded-full text-sm hover:border-ink/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-full text-sm transition-colors"
                  >
                    {saving ? "Saving..." : editingId ? "Save Changes" : "Add Cause"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink/70 mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm focus-ring focus:border-blue-400 outline-none"
      />
    </div>
  );
}
