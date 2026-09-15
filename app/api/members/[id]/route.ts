import { env } from "cloudflare:workers";
import { identityFromHeaders, resolveMemberAccess } from "@/lib/member-access";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await resolveMemberAccess(identityFromHeaders(request.headers));
  if (!access?.isAdmin) {
    return Response.json({ error: "Administrator access is required." }, { status: 403 });
  }
  if (!env.DB) {
    return Response.json({ error: "Membership storage is unavailable." }, { status: 503 });
  }

  const { id } = await context.params;
  const memberId = Number(id);
  if (!Number.isInteger(memberId) || memberId < 1) {
    return Response.json({ error: "Invalid member record." }, { status: 400 });
  }

  const result = await env.DB.prepare(
    "UPDATE members SET active = 0 WHERE id = ? AND role != 'admin'",
  )
    .bind(memberId)
    .run();

  if (!result.meta.changes) {
    return Response.json({ error: "Member record was not found." }, { status: 404 });
  }

  return Response.json({ message: "Member access revoked." });
}
