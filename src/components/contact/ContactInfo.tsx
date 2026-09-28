import { MailIcon, PhoneIcon, LocationIcon } from "./ContactIcons";
import {
  EMAIL as EMAIL_FB,
  FACTORY_ADDRESS as ADDR_FB,
  PHONE_NUMBERS as PHONES_FB,
  SHOWROOMS as SR_FB,
} from "./contact-data";
import type { ContactInfoDTO, DealershipDTO } from "@/types/dto";

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 lg:gap-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#005eb8] lg:size-10">
        <span className="size-6 lg:size-[30px]">{icon}</span>
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-[16px] font-extrabold tracking-[0.005em] text-black lg:text-[24px]">{label}</p>
        <div className="text-[14px] leading-[22px] tracking-[0.005em] text-[#8a8a8a] lg:text-[20px] lg:leading-[31px]">
          {children}
        </div>
      </div>
    </div>
  );
}

type Props = {
  className?: string;
  contactInfo?: ContactInfoDTO;
  dealerships?: DealershipDTO[];
};

export default function ContactInfo({ className = "", contactInfo, dealerships }: Props) {
  const email = contactInfo?.emails[0] ?? EMAIL_FB;
  const phones = contactInfo?.phones.map((p) => p.number) ?? PHONES_FB;
  const address = contactInfo?.address ?? ADDR_FB;
  const showrooms =
    dealerships && dealerships.length > 0
      ? dealerships.map((d) => ({
          city: d.city,
          address: [d.address, d.state].filter(Boolean).join(", "),
          phone: d.phone,
        }))
      : SR_FB.map((s) => ({
          city: s.city,
          address:
            s.subLocations?.map((l) => `${l.label} – ${l.address}`).join("\n") ??
            s.address,
        }));

  return (
    <div className={`font-[family-name:var(--font-google-sans)] flex w-full flex-col gap-6 lg:w-[522px] lg:gap-10 ${className}`}>
      <div className="flex flex-col gap-3">
        <h2 className="text-[20px] font-extrabold text-[#333333] lg:text-[40px] lg:leading-[62px]">
          Get In Touch with us
        </h2>
        <p className="text-[14px] leading-[22px] tracking-[0.02em] text-[#8a8a8a] lg:text-[20px] lg:leading-[31px]">
          Reach out to our sales, service and finance teams — we respond within one business day.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:gap-10">
        <InfoRow icon={<MailIcon className="size-full" />} label="E-Mail">
          <a href={`mailto:${email}`}>{email}</a>
        </InfoRow>

        <InfoRow icon={<PhoneIcon className="size-full" />} label="Phone Numbers">
          <div className="flex flex-col">
            {phones.map((number) => (
              <a key={number} href={`tel:${number.replace(/\s/g, "")}`}>
                {number}
              </a>
            ))}
          </div>
        </InfoRow>

        <InfoRow icon={<LocationIcon className="size-full" />} label="Factory Address">
          <p>{address}</p>
        </InfoRow>
      </div>

      <div id="showrooms" className="flex flex-col gap-3 lg:gap-3">
        <h3 className="text-[16px] font-extrabold capitalize text-black lg:text-[24px]">Showroom Addresses</h3>

        <div className="flex flex-col gap-6 lg:gap-8">
          {showrooms.map((showroom) => (
            <div key={showroom.city} className="flex flex-col gap-3">
              <p className="text-[14px] font-extrabold uppercase tracking-[0.005em] text-[#1e1e1e] lg:text-[20px]">
                {showroom.city}
              </p>
              <p className="text-[14px] leading-[22px] tracking-[0.005em] text-[#8a8a8a] lg:text-[20px] lg:leading-[31px] whitespace-pre-line">
                {showroom.address}
              </p>
              {"phone" in showroom && showroom.phone ? (
                <p className="text-[14px] font-semibold tracking-[0.005em] text-[#1e1e1e] lg:text-[16px]">
                  {showroom.phone}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
