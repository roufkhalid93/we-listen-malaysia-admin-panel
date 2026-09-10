import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJSON<T>(file: string): Promise<T> {
  const filePath = path.join(DATA_DIR, file);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJSON<T>(file: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export type Cause = {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  summary: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  peopleHelped: number;
  priority: boolean;
  status: "active" | "completed";
  location: string;
  createdAt: string;
};

export type Donation = {
  id: string;
  causeId: string;
  causeTitle: string;
  name: string;
  email: string;
  amount: number;
  message?: string;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type OrgStats = {
  volunteers: number;
  yearsActive: number;
  partnerCommunities: number;
};

export const CausesStore = {
  getAll: () => readJSON<Cause[]>("causes.json"),
  saveAll: (data: Cause[]) => writeJSON("causes.json", data),
};

export const DonationsStore = {
  getAll: () => readJSON<Donation[]>("donations.json"),
  saveAll: (data: Donation[]) => writeJSON("donations.json", data),
};

export const MessagesStore = {
  getAll: () => readJSON<ContactMessage[]>("messages.json"),
  saveAll: (data: ContactMessage[]) => writeJSON("messages.json", data),
};

export const StatsStore = {
  get: () => readJSON<OrgStats>("stats.json"),
};
