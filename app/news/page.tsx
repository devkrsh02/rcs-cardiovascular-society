import type { Metadata } from "next";
import { formatNewsDate, newsArticles } from "@/lib/news";

export const metadata: Metadata = {
  title: "Cardiology News | RCS",
  description:
    "The RCS Tuesday cardiology news archive: student-focused narratives with images and direct links to the evidence.",
};

export default function NewsArchive() {
  return (
    <>
      <a className="skip-link" href="#news-archive">
        Skip to articles
      </a>
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
          <a aria-current="page" href="/news">News</a>
          <a href="/#about">About</a>
          <a href="/#board">Board</a>
          <a href="/resources">Resources</a>
        </nav>
      </header>

      <main id="news-archive" className="news-page">
        <header className="news-masthead">
          <div>
            <p className="eyebrow">Every Tuesday</p>
            <h1>Cardiology news, read beyond the headline.</h1>
          </div>
          <p>
            RCS explains a major development in cardiovascular medicine through a
            student-focused narrative, supported by images and direct links to the
            original evidence.
          </p>
        </header>

        {newsArticles.length > 0 ? (
          <section className="news-archive" aria-label="Published cardiology articles">
            {newsArticles.map((article, index) => (
              <article className={`news-card${index === 0 ? " news-card-featured" : ""}`} key={article.slug}>
                {article.thumbnail ? (
                  <a className="news-card-image" href={`/news/${article.slug}`} aria-label={`Read ${article.title}`}>
                    <img src={article.thumbnail} alt={article.thumbnailAlt || ""} />
                  </a>
                ) : null}
                <div className="news-card-date">
                  <span>{index === 0 ? "Latest edition" : "Tuesday edition"}</span>
                  <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
                </div>
                <div className="news-card-copy">
                  <h2>
                    <a href={`/news/${article.slug}`}>{article.title}</a>
                  </h2>
                  <p>{article.summary}</p>
                  <a className="news-read-link" href={`/news/${article.slug}`}>
                    Read article <span aria-hidden="true">→</span>
                  </a>
                </div>
                <span className="news-reading-time">{article.readingMinutes} min read</span>
              </article>
            ))}
          </section>
        ) : (
          <section className="news-empty" aria-labelledby="news-empty-title">
            <span className="news-empty-mark" aria-hidden="true">RCS</span>
            <div>
              <p className="eyebrow">Archive opening soon</p>
              <h2 id="news-empty-title">The first Tuesday edition is being prepared.</h2>
              <p>
                Published articles will appear here in date order. Each one will include
                the full narrative, relevant images and links to its sources.
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer news-footer">
        <div className="brand footer-brand">
          <img src="/rcs-logo.jpeg" alt="" />
          <span>
            <strong>RCS</strong>
            <small>RSU Cardiovascular Society</small>
          </span>
        </div>
        <p>Cardiology news · New edition every Tuesday</p>
        <a href="/">Back to the society homepage →</a>
      </footer>
    </>
  );
}
