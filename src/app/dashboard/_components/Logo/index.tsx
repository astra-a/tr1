import Link from "next/link";
import Image from "@/app/dashboard/_components/Image";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      className={`block w-12 h-12 ${className || ""}`}
      href={ROUTES.dashboard}
    >
      <Image
        className="size-full opacity-100 dark:!hidden"
        src="/images/dashboard/logo.png"
        alt="logo"
        width={48}
        height={48}
        priority
        quality={100}
      />
      <Image
        className="size-full !hidden opacity-100 dark:!block"
        src="/images/dashboard/logo.png"
        alt="logo"
        width={48}
        height={48}
        priority
        quality={100}
      />
    </Link>
  );
};

export default Logo;
