"use Client";

import StatCard from "@/components/StatCard";
import { DollarSign, SquareActivity, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SalesoverviewShart from "@/components/SalesoverviewShart";
import UsersDistributionChart from "@/components/UsersDistributionChart";
import { fetchAssets, fetchProblemCount, fetchUsers } from "../utils/fetchData";

const transformUsersToChartData = (users) => {
  const map = { May: 0 };
  const premium = { May: 0, Jun:0 };

  users.forEach((user) => {
    const month = new Date(user.createdAt).toLocaleString("en-US", {
      month: "short",
    });

    if (!map[month]) {
      map[month] = 0;
      premium[month] = 0;
    }

    if (user.role === "Premium") {
      if (!premium[month]) premium[month] = 0;

      premium[month] += 1;
    }

    map[month] += 1;
  });

  return Object.entries(map).map(([month, count]) => ({
    name: month, // "Jan", "Feb", ...
    sales: count, // Anzahl User
    kiCosts: premium[month],
  }));
};

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

  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState(0);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchUsers(setUsers);
    fetchProblemCount(setProblems);
    fetchAssets(setAssets);
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Sales" icon={DollarSign} value={0} />
          <StatCard name="Total Users" icon={Users} value={users.filter(user=>user.verified).length} />
          <StatCard
            name="Total Premium Users"
            icon={Users}
            value={users.filter(user=>user.role==="Premium").length}
          />
          <StatCard name="Problems" icon={SquareActivity} value={problems} />
        </motion.div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <SalesoverviewShart data={salesData} title={"Sales Overview"} />
          <SalesoverviewShart data={assets} title={"Onboarding Flow"} />
          <SalesoverviewShart
            data={transformUsersToChartData(users)}
            title={"Users Overview"}
          />
          <UsersDistributionChart data={users} />
        </div>
      </main>
    </div>
  );
}

export default Overview;
