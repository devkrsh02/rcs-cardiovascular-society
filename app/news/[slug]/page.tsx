import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatNewsDate, getNewsArticle, newsArticles } from "@/lib/news";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) return { title: "Article not found | RCS" };

  return {
    title: `${article.title} | RCS Cardiology News`,
    description: article.summary,
  };
}

export default async function NewsArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) notFound();

  return (
    <>
      <a className="skip-link" href="#article-body">Skip to article</a>
      <header className="site-header article-header">
        <a className="brand" href="/" aria-label="RCS home">
          <img src="/rcs-logo.jpeg" alt="" />
          <span>
            <strong>RCS</strong>
            <small>RSU Cardiovascular Society</small>
          </span>
        </a>
        <nav aria-label="Article navigation">
          <a href="/news">All cardiology news</a>
          <a className="nav-login" href="/members">Member area</a>
        </nav>
      </header>

      <main className="article-page">
        <header className="article-masthead">
          <a className="article-back" href="/news">← Tuesday news archive</a>
          <p className="eyebrow">RCS Cardiology News</p>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.summary}</p>
          <div className="article-byline">
            <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
            <span>{article.readingMinutes} min read</span>
          </div>
        </header>

        <article className="article-body" id="article-body">
          {article.sections.map((section, sectionIndex) => (
            <div className="article-section" key={`${article.slug}-${sectionIndex}`}>
              {section.heading ? <h2>{section.heading}</h2> : null}
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={`${article.slug}-${sectionIndex}-${paragraphIndex}`}>{paragraph}</p>
              ))}
              {article.images
                .filter((image) => image.afterSection === sectionIndex)
                .map((image) => (
                  <figure key={image.src}>
                    <img src={image.src} alt={image.alt} />
                    {image.caption || image.credit ? (
                      <figcaption>
                        {image.caption}
                        {image.caption && image.credit ? " · " : ""}
                        {image.credit ? `Image: ${image.credit}` : ""}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
            </div>
          ))}

          <aside className="article-references" aria-labelledby="article-references-title">
            <p className="eyebrow">References</p>
            <h2 id="article-references-title">Read the original sources</h2>
            <ol>
              {article.references.map((reference) => (
                <li key={reference.url}>
                  <a href={reference.url} target="_blank" rel="noreferrer">
                    {reference.label}
                    {reference.publisher ? ` — ${reference.publisher}` : ""}
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        </article>
      </main>

      <footer className="site-footer news-footer">
        <a href="/news">← More cardiology news</a>
        <p>RCS · New edition every Tuesday</p>
        <a href="/">Society homepage →</a>
      </footer>
    </>
  );
}
