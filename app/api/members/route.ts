import { env } from "cloudflare:workers";
import { identityFromHeaders, resolveMemberAccess } from "@/lib/member-access";
import { getSemester } from "@/lib/semester";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const access = await resolveMemberAccess(identityFromHeaders(request.headers));
  if (!access?.isAdmin) {
    return Response.json({ error: "Administrator access is required." }, { status: 403 });
  }
  if (!env.DB) {
    return Response.json({ error: "Membership storage is unavailable." }, { status: 503 });
  }

  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const fullName = String(form.get("fullName") ?? "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid member email address." }, { status: 400 });
  }
  if (fullName.length > 100 || email.length > 180) {
    return Response.json({ error: "The member details are too long." }, { status: 400 });
  }

  const semester = getSemester();
  const createdAt = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO members
      (email, full_name, role, semester_key, valid_from, valid_until, active, created_at)
     VALUES (?, ?, 'member', ?, ?, ?, 1, ?)
     ON CONFLICT(email, semester_key) DO UPDATE SET
       full_name = excluded.full_name,
       valid_from = excluded.valid_from,
       valid_until = excluded.valid_until,
       active = 1`,
  )
    .bind(email, fullName || null, semester.key, semester.start, semester.end, createdAt)
    .run();

  return Response.json({ message: `Member approved for ${semester.name}.` });
}
