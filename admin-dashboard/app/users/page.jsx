"use client"
import React from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/StatCard'
import { RotateCcw, User, UserCheck, UserPlus, Users, UsersIcon } from 'lucide-react'
import UsersTable from '@/components/UsersTable'

const UsersPage = () => {
  return (
    <div className='flex-1 overflow-hidden relative z-10'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{duration:1}}
            className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
        >
            <StatCard name={"Total Users"} icon={UsersIcon} value={7612}/>
            <StatCard name={"New Users"} icon={UserPlus} value={860}/>
            <StatCard name={"Active Users"} icon={UserCheck} value={4080}/>
            <StatCard name={"Returning Users"} icon={RotateCcw} value={2730}/>
        </motion.div>
        <UsersTable />
      </main>
    </div>
  )
}

export default UsersPage
