import {
  FacebookMonoIcon,
  LinkedInMonoIcon,
  WhatsAppMonoIcon,
  XMonoIcon,
  InstagramMonoIcon,
  YouTubeMonoIcon,
} from "./ContactIcons";
import type { ContactInfoDTO } from "@/types/dto";

type SocialLink = { platform: string; url: string; order?: number };

export default function SocialRow({
  socialLinks,
}: {
  socialLinks?: ContactInfoDTO["socialLinks"];
}) {
  const items =
    socialLinks && socialLinks.length > 0
      ? socialLinks
          .slice()
          .sort((a: SocialLink, b: SocialLink) => (a.order ?? 0) - (b.order ?? 0))
          .map((s: SocialLink) => ({ platform: s.platform as string, url: s.url }))
      : [
          { platform: "facebook", url: "#" },
          { platform: "linkedin", url: "#" },
          { platform: "whatsapp", url: "#" },
        ];

  function renderIcon(platform: string, cls: string) {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <FacebookMonoIcon className={cls} />;
      case "linkedin":
        return <LinkedInMonoIcon className={cls} />;
      case "whatsapp":
        return <WhatsAppMonoIcon className={cls} />;
      case "twitter":
      case "x":
        return typeof XMonoIcon === "function" ? (
          <XMonoIcon className={cls} />
        ) : (
          <FacebookMonoIcon className={cls} />
        );
      case "instagram":
        return typeof InstagramMonoIcon === "function" ? (
          <InstagramMonoIcon className={cls} />
        ) : (
          <FacebookMonoIcon className={cls} />
        );
      case "youtube":
        return typeof YouTubeMonoIcon === "function" ? (
          <YouTubeMonoIcon className={cls} />
        ) : (
          <FacebookMonoIcon className={cls} />
        );
      default:
        return <FacebookMonoIcon className={cls} />;
    }
  }

  return (
    <div className="font-[family-name:var(--font-google-sans)] flex flex-col items-center gap-4 py-12 lg:gap-4 lg:py-16">
      <p className="text-[16px] font-extrabold tracking-[0.005em] text-[#1e1e1e] lg:text-[24px]">
        Follow Us:
      </p>
      <div className="flex items-center gap-8 lg:gap-10">
        {items.map((s: { platform: string; url: string }) => (
          <a
            key={`${s.platform}-${s.url}`}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.platform}
          >
            {renderIcon(s.platform, "size-8")}
          </a>
        ))}
      </div>
    </div>
  );
}
