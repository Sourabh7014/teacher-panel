import WebsitePage from "./website/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Panel",
  description: "Teacher Panel",
};

export default function Page() {
  return <WebsitePage />;
}
