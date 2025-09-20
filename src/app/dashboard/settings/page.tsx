import SettingsPage from "@/app/dashboard/_templates/SettingsPage";
import { getAuthUser } from "@/app/dashboard/_helpers/users";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await getAuthUser();
  if (!user) {
    return redirect(ROUTES.login);
  }
  return <SettingsPage user={user} />;
}
