import { env } from "cloudflare:workers";

export type MemberRecord = {
  id: number;
  email: string;
  fullName: string | null;
  role: string;
  semesterKey: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
};

export type ResourceRecord = {
  id: string;
  title: string;
  category: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  uploadedAt: string;
};

export async function listMembers(semesterKey: string): Promise<MemberRecord[]> {
  if (!env.DB) return [];
  const result = await env.DB.prepare(
    `SELECT id, email, full_name, role, semester_key, valid_from, valid_until, active
     FROM members
     WHERE semester_key = ?
     ORDER BY active DESC, lower(COALESCE(full_name, email)) ASC`,
  )
    .bind(semesterKey)
    .all<{
      id: number;
      email: string;
      full_name: string | null;
      role: string;
      semester_key: string;
      valid_from: string;
      valid_until: string;
      active: number;
    }>();

  return (result.results ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    semesterKey: row.semester_key,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    active: Boolean(row.active),
  }));
}

export async function listResources(): Promise<ResourceRecord[]> {
  if (!env.DB) return [];
  const result = await env.DB.prepare(
    `SELECT id, title, category, original_filename, content_type, size_bytes, uploaded_at
     FROM resources
     ORDER BY uploaded_at DESC`,
  ).all<{
    id: string;
    title: string;
    category: string;
    original_filename: string;
    content_type: string;
    size_bytes: number;
    uploaded_at: string;
  }>();

  return (result.results ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    originalFilename: row.original_filename,
    contentType: row.content_type,
    sizeBytes: row.size_bytes,
    uploadedAt: row.uploaded_at,
  }));
}
