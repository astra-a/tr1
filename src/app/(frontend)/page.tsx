import { SITE_TYPE } from "@/constants";
import SalesHome from "./_components/Home-Sales";
import ProjectHome from "./_components/Home-Project";

export default function Home() {
  return "sales" === SITE_TYPE ? <SalesHome /> : <ProjectHome />;
}
