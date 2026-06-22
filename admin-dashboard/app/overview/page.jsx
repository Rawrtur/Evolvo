"use Client";

import StatCard from "@/components/StatCard";
import { DollarSign, ShoppingBag, SquareActivity, Users } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import SalesoverviewShart from "@/components/SalesoverviewShart";
import UsersDistributionChart from "@/components/UsersDistributionChart";

function Overview() {
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

  const usersData = [
    {kiCosts:0 , sales: 0, name: "Jan" },
    {kiCosts:5 , sales: 50, name: "Feb" },
    {kiCosts:12 , sales: 123, name: "Mar" },
    {kiCosts:23 , sales: 235, name: "Apr" },
    {kiCosts:38 , sales: 389, name: "May" },
    {kiCosts:40 , sales: 400, name: "Jun" },
    {kiCosts:55 , sales: 550, name: "Jul" },
    {kiCosts:61 , sales: 613, name: "Aug" },
    {kiCosts:71 , sales: 718, name: "Sep" },
    {kiCosts:88 , sales: 889, name: "Oct" },
    {kiCosts:95 , sales: 953, name: "Nov" },
    {kiCosts:206 , sales: 1066, name: "Dez" },
  ];

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Sales" icon={DollarSign} value="182.34€" />
          <StatCard name="Total Clients" icon={Users} value="1.437" />
          <StatCard name="Total Premium Clients" icon={Users} value="671" />
          <StatCard name="Events" icon={SquareActivity} value="12.748" />
        </motion.div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <SalesoverviewShart data={salesData} title={"Sales Overview"} />
          <SalesoverviewShart data={usersData} title={"Users Overview"} />
          <UsersDistributionChart />
        </div>
      </main>
    </div>
  );
}

export default Overview;
