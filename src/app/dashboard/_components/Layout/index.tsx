import { ReactElement, ReactNode, useEffect, useState } from "react";
import Sidebar from "@/app/dashboard/_components/Sidebar";
import Header from "@/app/dashboard/_components/Header";
import ThemeButton from "@/app/dashboard/_components/ThemeButton";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

type LayoutProps = {
  title?: string;
  children: ReactNode;
  hideSidebar?: boolean;
  createButtonUrl?: string;
  customHeaderActions?: ReactElement;
};

const Layout = ({
  title,
  children,
  hideSidebar,
  createButtonUrl = ROUTES.posts_new,
  customHeaderActions,
}: LayoutProps) => {
  const [visibleSidebar, setVisibleSidebar] = useState(false);

  useEffect(() => {
    const scrollWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${scrollWidth}px`,
    );

    return () => {
      document.documentElement.style.removeProperty("--scrollbar-width");
    };
  }, []);

  return (
    <div
      className={`${
        hideSidebar ? "" : "pl-85 max-4xl:pl-70 max-3xl:pl-60 max-xl:pl-0"
      }`}
    >
      <Sidebar
        visibleSidebar={visibleSidebar}
        hideSidebar={hideSidebar}
        onCloseSidebar={() => {
          setVisibleSidebar(false);
        }}
      />
      <div
        className={`fixed inset-0 z-30 bg-shade-07/70 transition-all duration-300 dark:bg-shade-04/90 ${
          visibleSidebar ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => {
          setVisibleSidebar(false);
        }}
      ></div>
      <Header
        className={`${
          visibleSidebar ? "right-[calc(0px+var(--scrollbar-width))]" : ""
        }`}
        title={title}
        hideSidebar={hideSidebar}
        createButtonUrl={createButtonUrl}
        customActions={customHeaderActions}
        onToggleSidebar={() => {
          setVisibleSidebar(!visibleSidebar);
        }}
      />
      <div
        className={`pt-22 pb-5 max-md:pt-18 ${customHeaderActions ? "max-md:!pt-33" : ""}`}
      >
        <div className={`${hideSidebar ? "center" : "center-with-sidebar"}`}>
          {children}
        </div>
      </div>
      {hideSidebar && (
        <ThemeButton className="fixed left-5 bottom-5 z-10 max-lg:hidden" />
      )}
    </div>
  );
};

export default Layout;
