import { useEffect, useState } from "react";
import Jdenticon from "react-jdenticon";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
} from "@headlessui/react";
import Icon from "@/app/dashboard/_components/Icon";
import Modal from "@/app/dashboard/_components/Modal";
import Login from "@/app/dashboard/_components/Login";
import { navigationUser } from "@/app/dashboard/_contstants/navigation";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import { toast } from "sonner";
import { GetAuthUser } from "@/app/dashboard/server-actions";

const User = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const router = useRouter();
  const logoutMutation = useMutation({
    mutationFn: async (): Promise<{ ok: boolean; message: string }> => {
      return axiosInstance.post(ROUTES.logout_action);
    },
  });
  const handleLogout = async () => {
    try {
      const resp = await logoutMutation.mutateAsync();
      if (resp.ok) {
        toast.success(resp.message);
        router.replace(ROUTES.login);
      } else {
        toast.error(resp.message);
        return false;
      }
    } catch (err: any) {
      toast.error(err?.toString());
      return false;
    }
  };

  const [avatarText, setAvatarText] = useState("");
  useEffect(() => {
    GetAuthUser().then((resp) => {
      if (resp?.email) {
        setAvatarText(resp.email);
      }
    });
  }, []);

  return (
    <>
      <Menu className="group" as="div">
        <div className="fixed inset-0 z-30 bg-b-surface1/70 invisible opacity-0 transition-all group-[[data-open]]:visible group-[[data-open]]:opacity-100"></div>
        <MenuButton className="relative z-40 w-12 h-12 flex justify-center items-center overflow-hidden transition-colors border-[0.15625rem] border-b-surface2 data-[hover]:border-primary-01 data-[active]:border-primary-01">
          {avatarText ? <Jdenticon size={40} value={avatarText} /> : <></>}
        </MenuButton>
        <MenuItems
          className="z-100 w-67.5 p-3 rounded-4xl bg-b-surface2 border-1 border-s-subtle outline-none shadow-dropdown [--anchor-gap:0.625rem] [--anchor-offset:0.625rem] origin-top transition duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 max-md:w-[calc(100vw-1.5rem)] max-md:[--anchor-offset:0]"
          anchor="bottom end"
          transition
        >
          {navigationUser.map((link, index) => (
            <MenuItem key={index}>
              <Link
                className={`group/item relative flex items-center h-12 px-3 text-button text-t-secondary transition-colors data-[focus]:text-t-primary before:absolute before:inset-0 before:rounded-[16px] before:bg-linear-to-b before:from-shade-09 before:to-[#ebebeb] before:opacity-0 before:transition-opacity after:absolute after:inset-0.25 after:bg-b-pop after:rounded-[15px] after:opacity-0 after:transition-opacity ${
                  link.title === "Upgrade to Pro" ? "!text-primary-01" : ""
                } ${
                  isActive(link.href)
                    ? "!text-t-primary before:opacity-100 after:opacity-100 dark:before:opacity-[0.075]"
                    : ""
                }`}
                href={link.href}
              >
                <Icon
                  className={`relative z-2 mr-4 fill-t-secondary transition-colors group-[[data-focus]]/item:fill-t-primary ${
                    link.title === "Upgrade to Pro" ? "!fill-primary-01" : ""
                  } ${isActive(link.href) ? "!fill-t-primary" : ""}`}
                  name={link.icon}
                />
                <div className="relative z-2">{link.title}</div>
              </Link>
            </MenuItem>
          ))}
          <MenuSeparator className="-mx-3 my-3 h-px bg-s-subtle" />
          <MenuItem>
            <button
              type="button"
              className="group/item flex items-center w-full h-12 px-3 text-button text-t-secondary transition-colors data-[focus]:text-t-primary"
              onClick={handleLogout}
            >
              <Icon
                className="mr-4 fill-t-secondary transition-colors group-[[data-focus]]/item:fill-t-primary"
                name="logout"
              />
              Log Out
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
      {/*<Modal*/}
      {/*  classWrapper="!max-w-120 p-16 bg-b-surface2"*/}
      {/*  open={isOpen}*/}
      {/*  onClose={() => setIsOpen(false)}*/}
      {/*>*/}
      {/*  <Login />*/}
      {/*</Modal>*/}
    </>
  );
};

export default User;
