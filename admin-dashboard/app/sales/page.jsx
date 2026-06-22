"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesoverviewShart from "@/components/SalesoverviewShart";
import UsersDistributionChart from "@/components/UsersDistributionChart";
import { fetchUsers } from "../utils/fetchData";

const salesData = [
  { sales: 300, kiCosts: 100, name: "Jan" },
  { sales: 400, kiCosts: 130, name: "Feb" },
  { sales: 423, kiCosts: 140, name: "Mar" },
  { sales: 535, kiCosts: 170, name: "Apr" },
  { sales: 489, kiCosts: 150, name: "May" },
  { sales: 500, kiCosts: 160, name: "Jun" },
  { sales: 550, kiCosts: 180, name: "Jul" },
  { sales: 613, kiCosts: 200, name: "Aug" },
  { sales: 718, kiCosts: 240, name: "Sep" },
  { sales: 689, kiCosts: 230, name: "Oct" },
  { sales: 653, kiCosts: 220, name: "Nov" },
  { sales: 766, kiCosts: 260, name: "Dez" },
];

const SalesPage = () => {
  const [users, setUsers] = useState([]);
  
    useEffect(() => {
      fetchUsers(setUsers)
    }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          <StatCard
            name={"Total Revenue"}
            icon={DollarSign}
            value={"$42,300"}
          />
          <StatCard
            name={"Avg Order Value"}
            icon={ShoppingCart}
            value={"$78,50"}
          />
          <StatCard name={"Total Sales"} icon={CreditCard} value={"$122,300"} />
          <StatCard name={"Total Growth"} icon={TrendingUp} value={"36.4%"} />
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SalesoverviewShart title={"Avg. Revenue"} data={salesData} />
          <UsersDistributionChart data={users} />
        </div>
      </main>
    </div>
  );
};

export default SalesPage;
