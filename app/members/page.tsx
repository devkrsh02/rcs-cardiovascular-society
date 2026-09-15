import { env } from "cloudflare:workers";
import { MemberWorkspace } from "./workspace";
import { listMembers, listResources } from "@/lib/member-data";
import { resolveRequestMemberAccess } from "@/lib/member-access";
import { formatSemesterRange, getSemester } from "@/lib/semester";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const semester = getSemester();
  const access = await resolveRequestMemberAccess();

  if (!access) {
    return (
      <main className="access-page">
        <div className="access-card">
          <img src="/rcs-logo.jpeg" alt="RSU Cardiovascular Society emblem" />
          <p className="eyebrow">Private member area</p>
          <h1>Sign in is required.</h1>
          <p>This area is available only to authorised RCS members.</p>
          <a className="button button-primary" href="/signin-with-chatgpt?return_to=/members" target="_top">
            Sign in with ChatGPT
          </a>
          <a className="plain-link" href="/">Return to the society site</a>
        </div>
      </main>
    );
  }

  if (!access.isActiveMember) {
    return (
      <main className="access-page">
        <div className="access-card">
          <img src="/rcs-logo.jpeg" alt="RSU Cardiovascular Society emblem" />
          <p className="eyebrow">{semester.name}</p>
          <h1>Your membership is not active for this semester.</h1>
          <p>
            Signed in as <strong>{access.email}</strong>. Access runs only for the
            semester in which a member is approved.
          </p>
          <div className="access-dates">
            <span>Current access period</span>
            <strong>{formatSemesterRange(semester)}</strong>
          </div>
          <a className="button button-primary" href="/">Return to the society site</a>
          <a className="plain-link" href="/signout-with-chatgpt?return_to=/" target="_top">Use another account</a>
        </div>
      </main>
    );
  }

  const [members, resources] = await Promise.all([
    access.isAdmin ? listMembers(semester.key) : Promise.resolve([]),
    listResources(),
  ]);

  return (
    <MemberWorkspace
      access={{
        email: access.email,
        displayName: access.memberName ?? access.fullName ?? access.email,
        isAdmin: access.isAdmin,
      }}
      members={members}
      resources={resources}
      semester={{
        key: semester.key,
        name: semester.name,
        range: formatSemesterRange(semester),
      }}
      storageReady={Boolean(env.DB && env.BUCKET)}
    />
  );
}
