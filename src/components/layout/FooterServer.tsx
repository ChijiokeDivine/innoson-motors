import Footer from "./Footer";
import { getContactInfo } from "@/server/globals";

export default async function ServerFooter() {
  let info;
  try {
    info = await getContactInfo();
  } catch {
    info = undefined;
  }
  return <Footer contactInfo={info} />;
}
