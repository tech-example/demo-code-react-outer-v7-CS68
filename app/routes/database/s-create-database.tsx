import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Database" },
    {
      name: "description",
      content: "SQL code to create the demo-school database.",
    },
  ];
}

const sqlCode = `CREATE DATABASE \`demo_school\`;`;

export default function CreateDatabasePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          สร้างฐานข้อมูล
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          คำสั่ง SQL สำหรับการสร้างฐานข้อมูล{" "}
          <code className="text-sm font-mono text-pink-400">demo-school</code>
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">คำสั่ง SQL</h2>
          <p className="text-gray-400 mb-4">
            คำสั่ง{" "}
            <code className="text-sm font-mono text-yellow-300">
              CREATE DATABASE
            </code>{" "}
            เป็นคำสั่งพื้นฐานใน SQL ที่ใช้เพื่อสร้างฐานข้อมูลใหม่
          </p>
          <CodeBlock code={sqlCode} language="sql" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
