"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { fetchProblems } from "../utils/fetchData";
import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import {
  EyeClosed,
  EyeIcon,
  Activity,
  Settings,
  Search,
  Edit,
  Trash2,
} from "lucide-react";

function page() {
  //"pending", "working", "closed"
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState(null);
  const [text, setText] = useState(null);

  const filterProblems = problems.filter(
    (prob) =>
      prob.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prob.status.includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    fetchProblems(setProblems);
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
          <StatCard
            name={"Total Problems"}
            icon={Activity}
            value={problems.length}
          />
          <StatCard
            name={"Pending Problems"}
            icon={EyeIcon}
            value={problems.filter((p) => p.status === "pending").length}
          />
          <StatCard
            name={"Working Problems"}
            icon={Settings}
            value={problems.filter((p) => p.status === "working").length}
          />
          <StatCard
            name={"Closed Problems"}
            icon={EyeClosed}
            value={problems.filter((p) => p.status === "closed").length}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-[#1e1e1e] backdrop-blur-md shadow-lg mb-5 rounded-xl p-4 sm:p-6 border border-[#1f1f1f] mx-2 sm:mx-0"
        >
            {text}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-[#1f1f1f] mx-2 sm:mx-0"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
            <h2 className="text-lg sm:text font-semibold text-gray-100 text-center sm:text-left">
              Problems
            </h2>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search Problems"
                className="bg-[#2f2f2f] text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  {["User", "Id", "Status", "Date", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-3 sm:px-6 px-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filterProblems.map((prob, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex flex-col sm:table-row mb-4 sm:mb-0 border-b sm:border-b-0 border-gray-700 sm:border-none p-2 sm:p-0"
                  >
                    {/*Mobile View */}
                    <td className="sm:hidden px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-100">
                              {prob.user}
                            </div>
                            <div className="text-xs text-gray-400">
                              {prob._id}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1 -mt-5 -mr-4">
                          <button className="text-indigo-500 hover:text-indigo-300" onClick={()=> {
                            setText(prob.problem)
                            setId(prob._id)
                          }}>
                            <Edit size={16} />
                          </button>
                          <button className="text-red-500 hover:text-red-300">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </td>
                    {/**Desktop View */}
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-100">
                          {prob.user}
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {prob._id}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {prob.status}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(prob.createdAt).getDate()}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button className="text-indigo-500 hover:text-indigo-300 mr-1 cursor-pointer" onClick={()=>{
                        setText(prob.problem);
                        setId(prob._id)
                      }}>
                        <Edit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-300 cursor-pointer">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default page;
