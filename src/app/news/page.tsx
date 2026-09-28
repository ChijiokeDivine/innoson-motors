import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import FooterServer from "@/components/layout/FooterServer";
import NewsPageContent from "@/components/news/NewsPageContent";
import { getPublishedPosts } from "@/server/blog";
import { postsAsArticles } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "News | Innoson Vehicle Manufacturing",
  description: "IVM news, manufacturing updates, financing news and driving reviews.",
};

export const revalidate = 60;

export default async function NewsPage() {
  let initial;
  try {
    const res = await getPublishedPosts({ limit: 20 });
    initial = postsAsArticles(res.docs);
  } catch {
    initial = undefined;
  }
  return (
    <>
      <Header active="news" />
      <main>
        <NewsPageContent initialArticles={initial} />
      </main>
      <FooterServer />
    </>
  );
}
