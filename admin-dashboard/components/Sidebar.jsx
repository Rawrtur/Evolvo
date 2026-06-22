"use client";
import React, { useEffect, useState } from "react";
import {
  House,
  DollarSign,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Mail,
  Users,
  Bell,
  Info,
  IconComponent,
  Menu,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const ICONS = {
  House,
  DollarSign,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Mail,
  Users,
  Bell,
  Info,
};

const sidebarItems = [
  { name: "Home", href: "/", icon: "House" },
  // { name: "Products", href: "/products", icon: "ShoppingBag" },
  { name: "Users", href: "/users", icon: "Users" },
  { name: "Sales", href: "/sales", icon: "DollarSign" },
  { name: "Settings", href: "/settings", icon: "Settings" },
  { name: "Messages", href: "/messages", icon: "Mail" },
  { name: "Notifications", href: "/notifications", icon: "Bell" },
  { name: "Help", href: "/help", icon: "Info" },
];

function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`}>
      <div className="h-full bg-[#1e1e1e] backdrop-blur-md p-4 flex flex-col border-r border-[#2f2f2f]">
        <button onClick={()=>setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-[#2f2f2f] transition-colors max-w-fit cursor-pointer">
            <Menu size={24}/>
        </button>
        <nav className="mt-8 flex-grow">
          {sidebarItems.map((item) => {
            const IconComponent = ICONS[item.icon];
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[#2f2f2f] transition-colors mb-2 ${
                    pathname === item.href ? "bg-[#2f2f2f]" : ""
                  }`}
                >
                  <IconComponent size={20} style={{ minWidth: "20px" }} />
                  {isSidebarOpen && <span className="ml-4 whitespace-nowrap">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
