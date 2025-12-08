"use client";
import { Layout, Menu, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useEffect, useState, useMemo } from "react";
import { FormSidebarItems } from "./FormSidebarItems";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const { Sider } = Layout;

const FormSidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const pathname = usePathname();
  const params = useSearchParams();
  const boatId = params.get("id");

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Tailwind's `lg` breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter out "Terms" item if boatId exists
  const filteredItems = useMemo(() => {
    return boatId
      ? FormSidebarItems.filter((item) => item.key !== "/boat-list-form/terms")
      : FormSidebarItems;
  }, [boatId]);

  const activeKeys = useMemo(() => {
    const keys: string[] = [];
    filteredItems.forEach((item) => {
      if (item.key === pathname || item.activePath?.includes(pathname)) {
        keys.push(item.key);
      }
    });
    return keys;
  }, [pathname, filteredItems]);

  // Sidebar content
  const SidebarContent = () => (
    <div className="bg-[#0037ff] h-full">
      <div className="flex items-center justify-center h-36">
        <Link href={"/"}>
          <Image
            src={logo}
            alt="logo"
            width={200}
            height={200}
            className="h-32 w-full"
          />
        </Link>
      </div>
      <Menu
        style={{ backgroundColor: "transparent", color: "#ffffff" }}
        mode="inline"
        selectedKeys={activeKeys}
        items={filteredItems}
        className="custom-sidebar-menu"
      />
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <Button
            type="text"
            icon={<MenuOutlined className="text-white text-2xl" />}
            className="fixed top-4 left-4 z-50 bg-[#0037FF] p-2 rounded-md lg:hidden"
            onClick={() => setDrawerVisible(true)}
          />
          <Drawer
            placement="left"
            closable={true}
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            bodyStyle={{ padding: 0 }}
            width={250}
          >
            {SidebarContent()}
          </Drawer>
        </>
      ) : (
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          width={300}
          style={{
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
            overflowY: "auto",
            backgroundColor: "#0037FF",
          }}
          className="hidden lg:block w-[300px]"
        >
          {SidebarContent()}
        </Sider>
      )}
    </>
  );
};

export default FormSidebar;
