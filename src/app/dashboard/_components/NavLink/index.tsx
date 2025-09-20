import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/app/dashboard/_components/Icon";
import { CountPosts } from "@/app/dashboard/posts/actions";
import { POST_STATUS } from "@/constants";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

type NavLinkProps = {
  value: {
    href: string;
    title: string;
    icon?: string;
    counter?: number;
  };
  onClick?: () => void;
};

const NavLink = ({ value, onClick }: NavLinkProps) => {
  const pathname = usePathname();

  const isActive = useMemo(() => {
    if (pathname === value.href) return true;

    switch (value.title) {
      case "Customer list":
        return pathname.includes(`${ROUTES.customers_customerList}/`);
      case "Shop":
        return pathname.includes(`${ROUTES.shop}/`);
      case "Refunds":
        return pathname.includes(`${ROUTES.income_refunds}/`);
      case "Media":
        return pathname.includes(`${ROUTES.media()}/`);
      case "Categories":
        return pathname.includes(`${ROUTES.categories()}/`);
      case "Pools":
        return pathname.includes(`${ROUTES.pools()}/`);
      // todo: add Posts
      default:
        return false;
    }
  }, [pathname, value.href, value.title]);

  const [counter, setCounter] = useState(0);
  useEffect(() => {
    switch (value.href) {
      case ROUTES.posts_drafts(): {
        CountPosts(POST_STATUS.Draft).then((num) => setCounter(num));
        break;
      }
      case ROUTES.posts_released(): {
        CountPosts(POST_STATUS.Published).then((num) => setCounter(num));
        break;
      }
    }
  }, [value]);

  return (
    <Link
      className={`group relative flex items-center shrink-0 gap-3 h-12 px-3 text-button transition-colors hover:text-t-primary ${
        value.icon ? "h-12" : "h-11"
      } ${isActive ? "text-t-primary" : "text-t-secondary"}`}
      href={value.href}
      key={value.title}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute inset-0 gradient-menu rounded-xl shadow-depth-menu">
          <div className="absolute inset-0.25 bg-b-pop rounded-[0.6875rem]"></div>
        </div>
      )}
      {value.icon && (
        <Icon
          className={`relative z-2 transition-colors group-hover:fill-t-primary ${
            isActive ? "fill-t-primary" : "fill-t-secondary"
          }`}
          name={value.icon}
        />
      )}
      <div className="relative z-2 mr-3">{value.title}</div>
      {counter > 0 && (
        <div
          className={`relative z-2 flex justify-center items-center w-6 h-6 ml-auto rounded-lg bg-secondary-01 text-button text-shade-01 ${
            value.title === "Scheduled" ? "bg-secondary-04" : ""
          }`}
        >
          {counter}
        </div>
      )}
    </Link>
  );
};

export default NavLink;
