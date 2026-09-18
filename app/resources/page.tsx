import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import { listResources } from "@/lib/member-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources | RCS",
  description:
    "Public RCS rules, regulations, revision materials and student research resources.",
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

export default async function PublicResourcesPage() {
  const storageReady = Boolean(env.DB && env.BUCKET);
  const resources = storageReady ? await listResources() : [];

  return (
    <>
      <a className="skip-link" href="#public-resources">Skip to resources</a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="RCS home">
          <img src="/rcs-logo.jpeg" alt="" />
          <span>
            <strong>RCS</strong>
            <small>RSU Cardiovascular Society</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/#activities">Activities</a>
          <a href="/news">News</a>
          <a href="/#about">About</a>
          <a href="/#board">Board</a>
          <a aria-current="page" href="/resources">Resources</a>
        </nav>
      </header>

      <main className="public-resources-page" id="public-resources">
        <header className="public-resources-heading">
          <div>
            <p className="eyebrow">Open-access library</p>
            <h1>RCS resources for everyone.</h1>
          </div>
          <p>
            Browse approved society rules, revision materials and research support
            documents. No account or active membership is required.
          </p>
        </header>

        {!storageReady ? (
          <div className="notice notice-error" role="status">
            The document library is temporarily unavailable. Please try again later.
          </div>
        ) : null}

        <section className="library-panel public-library" aria-labelledby="public-library-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Approved documents</p>
              <h2 id="public-library-title">Public library</h2>
            </div>
            <span>{resources.length} {resources.length === 1 ? "file" : "files"}</span>
          </div>
          {resources.length ? (
            <div className="resource-list">
              {resources.map((resource) => (
                <article className="resource-row" key={resource.id}>
                  <div className="file-mark">
                    {resource.originalFilename.split(".").pop()?.slice(0, 4).toUpperCase() || "FILE"}
                  </div>
                  <div>
                    <span className="resource-category">{resource.category}</span>
                    <h3>{resource.title}</h3>
                    <p>
                      {resource.originalFilename} · {formatSize(resource.sizeBytes)} · {formatDate(resource.uploadedAt)}
                    </p>
                  </div>
                  <a href={`/api/resources/${resource.id}`}>Download</a>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state compact-empty">
              <h3>No documents have been uploaded yet.</h3>
              <p>Approved RCS files will appear here as they are published.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer news-footer">
        <div className="brand footer-brand">
          <img src="/rcs-logo.jpeg" alt="" />
          <span>
            <strong>RCS</strong>
            <small>RSU Cardiovascular Society</small>
          </span>
        </div>
        <p>Public resources · Open to everyone</p>
        <a href="/">Back to the society homepage →</a>
      </footer>
    </>
  );
}
