import fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "we-listen-malaysia-dev-secret-change-me";
const COOKIE_NAME = "wlm_admin_session";
const DATA_DIR = path.join(process.cwd(), "data");

type AdminUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

async function getAdmins(): Promise<AdminUser[]> {
  const raw = await fs.readFile(path.join(DATA_DIR, "admin.json"), "utf-8");
  return JSON.parse(raw);
}

export async function verifyCredentials(email: string, password: string) {
  const admins = await getAdmins();
  const admin = admins.find(
    (a) => a.email.toLowerCase() === email.toLowerCase()
  );
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return null;
  return { id: admin.id, name: admin.name, email: admin.email };
}

export function createSessionToken(payload: {
  id: string;
  name: string;
  email: string;
}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

export function verifySessionToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: string;
      name: string;
      email: string;
    };
  } catch {
    return null;
  }
}

export async function getSessionFromCookies() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
