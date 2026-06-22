"use client";
import React, { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import germany from "../public/Flag_of_Germany.svg";

const USERS = [
  {
    name: "Artur",
    email: "nico-dierking@web.de",
    id: "+491331344",
    premium: true,
  },
  {
    name: "Artur",
    email: "nico-dierking@web.de",
    id: "+491331344",
    premium: false,
  },
  {
    name: "Artur",
    email: "nico-dierking@web.de",
    id: "+491331344",
    premium: false,
  },
  {
    name: "Artur",
    email: "nico-dierking@web.de",
    id: "+491331344",
    premium: false,
  },
  {
    name: "Artur",
    email: "nico-dierking@web.de",
    id: "+491331344",
    premium: true,
  },
];

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [users, setUsers] = useState(USERS);

  useEffect(()=> {
    // daten fetchen
  },[])

  const filterUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-[#1f1f1f] mx-2 sm:mx-0"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-lg sm:text font-semibold text-gray-100 text-center sm:text-left">
          Users
        </h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Users"
            className="bg-[#2f2f2f] text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Name", "Email", "Id", "Premium", "Actions"].map((header) => (
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
            {filterUsers.map((user, index) => (
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
                      <Image
                        src={germany}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full"
                        alt="country"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-100">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1 -mt-5 -mr-4">
                      <button className="text-indigo-500 hover:text-indigo-300">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-500 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-gray-300">
                    <div>Id: {user.id}</div>
                    <div>Premium: {user.premium ? "true": "false"}</div>
                  </div>
                </td>
                {/**Desktop View */}
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-100">
                      {user.name}
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.email}
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.id}
                </td>
                <td className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm ${user.premium ? "text-green-500" :"text-red-500"}`}>
                  {user.premium ? "true": "false"}
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-indigo-500 hover:text-indigo-300 mr-1 cursor-pointer">
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
  );
};

export default UsersTable;
