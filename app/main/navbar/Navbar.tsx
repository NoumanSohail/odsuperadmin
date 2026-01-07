"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MdDashboard, MdMenu, MdClose } from "react-icons/md";
import logo from "@/app/images/onduty-logo.png";
import { FcAbout } from "react-icons/fc";

const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/main/dashboard", icon: <MdDashboard size={24} /> },
  ];

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <div className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href} onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[18px] font-medium transition
              ${isActive ? "bg-(--color-secondary) text-black shadow-sm" : "text-(--color-gray) hover:bg-gray-200 hover:text-black"}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* 🔹 MOBILE HEADER */}
      <div className="absolute mt-2 ml-2 p-3 pb-10 md:hidden flex h-[3%] bg-(--color-secondary) text-(--color-primary) rounded-full transition-all">
        <button onClick={() => setOpen(true)}>
          <MdMenu size={28} />
        </button>
      </div>

      {/* 🔹 DESKTOP SIDEBAR */}
      <div className="h-screen bg-(--color-sidebar) xl:w-[18%] lg:w-[25%] shadow-md hidden md:flex flex-col p-4">
        <div className="flex justify-center mt-6 mb-12">
          <Image src={logo} alt="OnDuty Logo" width={150} height={60} className="object-contain" priority />
        </div>
        <NavLinks />
      </div>

      {/* 🔹 MOBILE SLIDE MENU */}
      {open && (
        <div className="fixed inset-0 md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative h-full w-[70%] bg-(--color-bg) shadow-lg px-5 mb-10 flex flex-col">
            <button onClick={() => setOpen(false)} className="absolute left-2 top-2 p-3 bg-(--color-secondary) text-(--color-primary) rounded-full transition-all">
              <MdClose size={28} />
            </button>
            <div className="flex justify-center">
              <Image src={logo} alt="OnDuty Logo" width={140} height={50} className="object-contain mt-20 mb-10" />
            </div>
            <NavLinks onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;