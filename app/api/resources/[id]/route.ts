import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

function contentDisposition(filename: string) {
  const ascii = filename.replace(/[^\x20-\x7E]+/g, "_").replace(/["\\]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!env.DB || !env.BUCKET) {
    return Response.json({ error: "Document storage is unavailable." }, { status: 503 });
  }

  const { id } = await context.params;
  const record = await env.DB.prepare(
    `SELECT object_key, original_filename, content_type
     FROM resources
     WHERE id = ?
     LIMIT 1`,
  )
    .bind(id)
    .first<{ object_key: string; original_filename: string; content_type: string }>();

  if (!record) return new Response("Document not found", { status: 404 });
  const object = await env.BUCKET.get(record.object_key);
  if (!object) return new Response("Document not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "content-type": record.content_type,
      "content-length": String(object.size),
      "content-disposition": contentDisposition(record.original_filename),
      "cache-control": "public, max-age=3600",
    },
  });
}
