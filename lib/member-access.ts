import { env } from "cloudflare:workers";
import { headers } from "next/headers";
import { getSemester } from "./semester";

export type Identity = {
  userId: string;
  email: string;
  fullName: string | null;
};

export type MemberAccess = Identity & {
  isAdmin: boolean;
  isActiveMember: boolean;
  memberName: string | null;
  role: string | null;
};

function decodeFullName(value: string | null, encoding: string | null) {
  if (!value || encoding !== "percent-encoded-utf-8") return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function identityFromHeaders(requestHeaders: Headers): Identity | null {
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  if (!userId || !email) return null;

  return {
    userId,
    email,
    fullName: decodeFullName(
      requestHeaders.get("oai-authenticated-user-full-name"),
      requestHeaders.get("oai-authenticated-user-full-name-encoding"),
    ),
  };
}

export async function getRequestIdentity() {
  return identityFromHeaders(await headers());
}

export async function resolveMemberAccess(identity: Identity | null): Promise<MemberAccess | null> {
  if (!identity) return null;

  const isAdmin = Boolean(
    env.ADMIN_EMAIL && identity.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase(),
  );
  if (isAdmin) {
    return {
      ...identity,
      isAdmin: true,
      isActiveMember: true,
      memberName: identity.fullName,
      role: "admin",
    };
  }

  if (!env.DB) {
    return {
      ...identity,
      isAdmin: false,
      isActiveMember: false,
      memberName: null,
      role: null,
    };
  }

  const semester = getSemester();
  const today = new Date().toISOString().slice(0, 10);
  const member = await env.DB.prepare(
    `SELECT id, full_name, role, authenticated_user_id
     FROM members
     WHERE active = 1
       AND semester_key = ?
       AND valid_from <= ?
       AND valid_until >= ?
       AND (
         authenticated_user_id = ?
         OR (authenticated_user_id IS NULL AND lower(email) = lower(?))
       )
     LIMIT 1`,
  )
    .bind(semester.key, today, today, identity.userId, identity.email)
    .first<{
      id: number;
      full_name: string | null;
      role: string;
      authenticated_user_id: string | null;
    }>();

  if (!member) {
    return {
      ...identity,
      isAdmin: false,
      isActiveMember: false,
      memberName: null,
      role: null,
    };
  }

  if (!member.authenticated_user_id) {
    await env.DB.prepare(
      `UPDATE members
       SET authenticated_user_id = ?
       WHERE id = ? AND authenticated_user_id IS NULL`,
    )
      .bind(identity.userId, member.id)
      .run();
  }

  return {
    ...identity,
    isAdmin: member.role === "admin",
    isActiveMember: true,
    memberName: member.full_name,
    role: member.role,
  };
}

export async function resolveRequestMemberAccess() {
  return resolveMemberAccess(await getRequestIdentity());
}
