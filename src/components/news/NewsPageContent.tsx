"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Container from "@/components/layout/Container";
import BlogCard from "./BlogCard";
import { ARTICLES } from "./news-data";

export default function NewsPageContent() {
  const [query, setQuery] = useState("");

  const featured = ARTICLES[0];
  const rest = ARTICLES.slice(1);

  const filteredRest = useMemo(() => {
    if (!query.trim()) return rest;
    const q = query.toLowerCase();
    return rest.filter((article) => article.title.toLowerCase().includes(q));
  }, [query, rest]);

  const showFeatured = !query.trim() || featured.title.toLowerCase().includes(query.toLowerCase());

  return (
    <section className="font-[family-name:var(--font-google-sans)] w-full py-10 lg:py-16 mt-10">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-black leading-[normal] text-black lg:text-[48px] lg:leading-[58px]">
              Our News Blog
            </h1>
            <p className="text-[16px] leading-[normal] text-[#524e4e] lg:text-[20px]">
              A center for all our news &amp; Resources
            </p>
          </div>

          <div className="relative w-full lg:w-[484px]">
            <div className="flex h-[48px] items-center gap-2 rounded-[4px] border-[0.5px] border-[#cfcfcf] bg-[#f0f0f0] px-3">
              <Image src="/icons/icon-search.svg" alt="" width={24} height={24} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for anything"
                className="h-full w-full bg-transparent text-[16px] text-[#524e4e] outline-none placeholder:text-[#524e4e]"
              />
            </div>
          </div>
        </div>

        {showFeatured && (
          <div className="mt-10 lg:mt-16">
            <BlogCard article={featured} featured />
          </div>
        )}

        {filteredRest.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {filteredRest.map((article) => (
              <BlogCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          !showFeatured && (
            <p className="mt-16 text-center text-[16px] text-[#878383]">
              No articles match &ldquo;{query}&rdquo;.
            </p>
          )
        )}
      </Container>
    </section>
  );
}