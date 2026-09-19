export type NewsReference = {
  label: string;
  url?: string;
  publisher?: string;
};

export type NewsImage = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  afterSection: number;
};

export type NewsSection = {
  heading?: string;
  paragraphs: string[];
};

export type NewsArticle = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readingMinutes: number;
  thumbnail?: string;
  thumbnailAlt?: string;
  sections: NewsSection[];
  images: NewsImage[];
  references: NewsReference[];
};

// Approved Tuesday articles are added here. The archive and article routes
// update automatically when an entry is published.
import { oculomicsArticle } from "./oculomics";

export const newsArticles: NewsArticle[] = [oculomicsArticle];

export function getNewsArticle(slug: string) {
  return newsArticles.find((article) => article.slug === slug);
}

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}
