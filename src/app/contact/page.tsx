import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import FooterServer from "@/components/layout/FooterServer";
import Container from "@/components/layout/Container";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import SocialRow from "@/components/contact/SocialRow";
import { getContactInfo, listDealerships } from "@/server/globals";
import type { ContactInfoDTO, DealershipDTO } from "@/types/dto";

export const metadata: Metadata = {
  title: "Contact Us | Innoson Vehicle Manufacturing",
  description:
    "Contact Innoson Motors sales, service, financing and showrooms across Nigeria.",
};

export const revalidate = 60;

export default async function ContactPage() {
  let info: ContactInfoDTO | undefined;
  let dealerships: DealershipDTO[];
  try {
    [info, dealerships] = await Promise.all([getContactInfo(), listDealerships()]);
  } catch {
    info = undefined;
    dealerships = [];
  }
  return (
    <>
      <Header active="contact" />
      <main>
        <ContactHero />

        <section className="w-full pb-12 lg:pb-16">
          <Container>
            <div className="flex flex-col-reverse gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-0 lg:rounded-[9px] lg:bg-[#f6f7f9] lg:p-[30px]">
              <ContactInfo contactInfo={info} dealerships={dealerships} />
              <ContactForm />
            </div>
          </Container>
        </section>

        <SocialRow socialLinks={info?.socialLinks} />
      </main>
      <FooterServer />
    </>
  );
}
