import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import FooterServer from "@/components/layout/FooterServer";
import ArticleContent from "@/components/news/ArticleContent";
import { getPublishedPosts, getPostBySlugOrNotFound } from "@/server/blog";
import { postsAsArticles } from "@/lib/adapters";
import type { Article } from "@/components/news/news-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const res = await getPublishedPosts({ limit: 200 });
    return res.docs.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const doc = await getPostBySlugOrNotFound(slug);
    return {
      title: `${doc.title} | Innoson Vehicle Manufacturing`,
      description: doc.excerpt ?? doc.title,
      openGraph: {
        title: doc.title,
        description: doc.excerpt ?? doc.title,
        images: doc.coverImage ? [doc.coverImage] : [],
      },
    };
  } catch {
    notFound();
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  let article: Article | null = null;
  try {
    const doc = await getPostBySlugOrNotFound(slug);
    article = postsAsArticles([doc])[0] ?? null;
  } catch {
    notFound();
  }
  if (!article) notFound();

  return (
    <>
      <Header active="news" />
      <main>
        <ArticleContent article={article} />
      </main>
      <FooterServer />
    </>
  );
}
