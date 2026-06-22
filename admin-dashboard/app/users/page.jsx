"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import {
  RotateCcw,
  User,
  UserCheck,
  UserPlus,
  Users,
  UsersIcon,
} from "lucide-react";
import UsersTable from "@/components/UsersTable";
import { fetchUsers } from "../utils/fetchData";

const UsersPage = () => {

  const [users, setUsers] = useState([]);
  
    useEffect(() => {
      fetchUsers(setUsers)
    }, []);

  return (
    <div className="flex-1 overflow-hidden relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          <StatCard name={"Total Users"} icon={UsersIcon} value={users.length} />
          <StatCard name={"New Users"} icon={UserPlus} value={users.length} />
          <StatCard name={"Active Users"} icon={UserCheck} value={users.length} />
          <StatCard name={"Returning Users"} icon={RotateCcw} value={users.length} />
        </motion.div>
        <UsersTable  users={users}/>
      </main>
    </div>
  );
};

export default UsersPage;
