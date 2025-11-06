"use client";

import { useState } from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, PlusOutlined, BookOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddPlaceModal from "./AddPlaceModal";

const { Header: AntHeader } = Layout;

export default function Header() {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);

  const getActiveKey = () => {
    if (pathname === "/") return "home";
    if (pathname?.startsWith("/search")) return "home";
    if (pathname?.startsWith("/details")) return "home";
    return "home";
  };

  return (
    <AntHeader className="!bg-white px-[50px] flex items-center justify-between shadow-sm sticky top-0 z-[1000]">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-8 h-8 bg-[#faad14] rounded flex items-center justify-center text-white font-bold text-lg">
          <BookOutlined />
        </div>
        <span className="font-bold text-base text-black">Шар ном</span>
      </Link>
      <Menu
        mode="horizontal"
        selectedKeys={[getActiveKey()]}
        className="border-none flex-1 justify-end"
        items={[
          {
            key: "home",
            icon: <HomeOutlined />,
            label: <Link href="/">Нүүр</Link>,
          },
          {
            key: "add",
            icon: <PlusOutlined />,
            label: "Нэмэх",
            onClick: () => setModalOpen(true),
          },
        ]}
      />

      <AddPlaceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          // Optionally refresh the page or show success message
          if (pathname === "/") {
            window.location.reload();
          }
        }}
      />
    </AntHeader>
  );
}
