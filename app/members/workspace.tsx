"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { MemberRecord, ResourceRecord } from "@/lib/member-data";

type Props = {
  access: { email: string; displayName: string; isAdmin: boolean };
  members: MemberRecord[];
  resources: ResourceRecord[];
  semester: { key: string; name: string; range: string };
  storageReady: boolean;
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function MemberWorkspace({ access, members, resources, semester, storageReady }: Props) {
  const router = useRouter();
  const [memberMessage, setMemberMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMemberMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/members", {
      method: "POST",
      body: new FormData(form),
    });
    const result = (await response.json()) as { message?: string; error?: string };
    setMemberMessage(result.message ?? result.error ?? "Unable to update membership.");
    if (response.ok) {
      form.reset();
      router.refresh();
    }
    setBusy(false);
  }

  async function revokeMember(id: number) {
    setBusy(true);
    setMemberMessage("");
    const response = await fetch(`/api/members/${id}`, { method: "DELETE" });
    const result = (await response.json()) as { message?: string; error?: string };
    setMemberMessage(result.message ?? result.error ?? "Unable to revoke membership.");
    if (response.ok) router.refresh();
    setBusy(false);
  }

  async function uploadResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setUploadMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/resources", {
      method: "POST",
      body: new FormData(form),
    });
    const result = (await response.json()) as { message?: string; error?: string };
    setUploadMessage(result.message ?? result.error ?? "Unable to upload the document.");
    if (response.ok) {
      form.reset();
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <main className="member-shell">
      <header className="member-header">
        <a className="brand" href="/" aria-label="RCS home">
          <img src="/rcs-logo.jpeg" alt="" />
          <span>
            <strong>RCS</strong>
            <small>Member area</small>
          </span>
        </a>
        <div className="member-account">
          <span>{access.isAdmin ? "Board administrator" : "Active member"}</span>
          <strong>{access.displayName}</strong>
          <a href="/signout-with-chatgpt?return_to=/" target="_top">Sign out</a>
        </div>
      </header>

      <section className="member-hero">
        <div>
          <p className="eyebrow">{semester.name}</p>
          <h1>Member library</h1>
          <p>Membership access is valid for {semester.range} and is checked each time this area opens.</p>
        </div>
        <div className="verified-badge">
          <span aria-hidden="true">✓</span>
          <div>
            <small>Access verified</small>
            <strong>{access.email}</strong>
          </div>
        </div>
      </section>

      {!storageReady && (
        <div className="notice notice-error" role="status">
          The document library is temporarily unavailable. Please try again later.
        </div>
      )}

      <section className="library-panel" aria-labelledby="library-title">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Approved documents</p>
            <h2 id="library-title">Resources</h2>
          </div>
          <span>{resources.length} {resources.length === 1 ? "file" : "files"}</span>
        </div>
        {resources.length ? (
          <div className="resource-list">
            {resources.map((resource) => (
              <article className="resource-row" key={resource.id}>
                <div className="file-mark">{resource.originalFilename.split(".").pop()?.slice(0, 4).toUpperCase() || "FILE"}</div>
                <div>
                  <span className="resource-category">{resource.category}</span>
                  <h3>{resource.title}</h3>
                  <p>{resource.originalFilename} · {formatSize(resource.sizeBytes)} · {formatDate(resource.uploadedAt)}</p>
                </div>
                <a href={`/api/resources/${resource.id}`}>Download</a>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state compact-empty">
            <h3>No documents have been uploaded yet.</h3>
            <p>Approved society files will appear here.</p>
          </div>
        )}
      </section>

      {access.isAdmin && (
        <div className="admin-grid">
          <section className="admin-panel" aria-labelledby="upload-title">
            <p className="eyebrow">Board controls</p>
            <h2 id="upload-title">Upload a resource</h2>
            <p className="panel-help">PDF, Word, PowerPoint, Excel, PNG or JPEG · maximum 12 MB.</p>
            <form onSubmit={uploadResource}>
              <label>
                Document title
                <input name="title" required maxLength={120} placeholder="e.g. RCS Constitution" />
              </label>
              <label>
                Category
                <select name="category" defaultValue="Rules & regulations">
                  <option>Rules &amp; regulations</option>
                  <option>Revision materials</option>
                  <option>Research support</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                File
                <input name="file" type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg" />
              </label>
              <button className="button button-primary" type="submit" disabled={busy || !storageReady}>
                Upload document
              </button>
              <p className="form-message" role="status">{uploadMessage}</p>
            </form>
          </section>

          <section className="admin-panel" aria-labelledby="members-title">
            <p className="eyebrow">Semester access</p>
            <h2 id="members-title">Active members</h2>
            <p className="panel-help">New approvals expire automatically at the end of {semester.name}.</p>
            <form onSubmit={addMember}>
              <label>
                Member name
                <input name="fullName" maxLength={100} placeholder="Full name" />
              </label>
              <label>
                Member email
                <input name="email" type="email" required maxLength={180} placeholder="name@example.com" />
              </label>
              <button className="button button-primary" type="submit" disabled={busy || !storageReady}>
                Approve for this semester
              </button>
              <p className="form-message" role="status">{memberMessage}</p>
            </form>

            <div className="member-list">
              {members.length ? members.map((member) => (
                <div key={member.id} className={member.active ? "" : "is-revoked"}>
                  <span>
                    <strong>{member.fullName || "Name not supplied"}</strong>
                    <small>{member.email}</small>
                  </span>
                  {member.active ? (
                    <button type="button" disabled={busy} onClick={() => revokeMember(member.id)}>Revoke</button>
                  ) : (
                    <em>Revoked</em>
                  )}
                </div>
              )) : <p className="member-list-empty">No member approvals recorded for this semester.</p>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
