import { env } from "cloudflare:workers";
import { identityFromHeaders, resolveMemberAccess } from "@/lib/member-access";

export const dynamic = "force-dynamic";

const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
]);

const allowedCategories = new Set([
  "Rules & regulations",
  "Revision materials",
  "Research support",
  "Other",
]);

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "document";
}

export async function POST(request: Request) {
  const access = await resolveMemberAccess(identityFromHeaders(request.headers));
  if (!access?.isAdmin) {
    return Response.json({ error: "Administrator access is required." }, { status: 403 });
  }
  if (!env.DB || !env.BUCKET) {
    return Response.json({ error: "Document storage is unavailable." }, { status: 503 });
  }

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const category = String(form.get("category") ?? "").trim();
  const file = form.get("file");

  if (!title || title.length > 120) {
    return Response.json({ error: "Enter a title of 120 characters or fewer." }, { status: 400 });
  }
  if (!allowedCategories.has(category)) {
    return Response.json({ error: "Choose a valid document category." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Choose a document to upload." }, { status: 400 });
  }
  if (file.size > 12 * 1024 * 1024) {
    return Response.json({ error: "The file must be 12 MB or smaller." }, { status: 413 });
  }
  if (!allowedTypes.has(file.type)) {
    return Response.json({ error: "This file type is not supported." }, { status: 415 });
  }

  const id = crypto.randomUUID();
  const objectKey = `resources/${id}-${safeFilename(file.name)}`;
  const uploadedAt = new Date().toISOString();

  await env.BUCKET.put(objectKey, file.stream(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { title, category, uploadedBy: access.userId },
  });

  try {
    await env.DB.prepare(
      `INSERT INTO resources
        (id, title, category, original_filename, object_key, content_type, size_bytes, uploaded_by_user_id, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        title,
        category,
        file.name,
        objectKey,
        file.type,
        file.size,
        access.userId,
        uploadedAt,
      )
      .run();
  } catch (error) {
    await env.BUCKET.delete(objectKey);
    throw error;
  }

  return Response.json({ message: "Document uploaded to the public library." });
}
