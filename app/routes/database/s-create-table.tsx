import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Tables" },
    {
      name: "description",
      content: "SQL code to create 'positions' and 'teachers' tables.",
    },
  ];
}

const sqlCode = `CREATE TABLE positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    telephone VARCHAR(12),
    img VARCHAR(255),
    position_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_teacher_position FOREIGN KEY (position_id)
    REFERENCES positions(id) ON DELETE SET NULL ON UPDATE CASCADE
);`;

export default function CreateTablePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          สร้างตาราง
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          คำสั่ง SQL สำหรับการสร้างตาราง{" "}
          <code className="text-sm font-mono text-pink-400">positions</code> และ{" "}
          <code className="text-sm font-mono text-pink-400">teachers</code>{" "}
          ที่จำเป็นสำหรับแอปพลิเคชัน
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">คำสั่ง SQL</h2>
          <p className="text-gray-400 mb-4">โค้ดนี้สร้างสองตาราง:</p>
          <ul className="text-gray-400 mb-6 space-y-2 list-disc list-inside">
            <li>
              <b className="text-pink-400">ตาราง positions</b>:
              ใช้เก็บข้อมูลตำแหน่งงาน เช่น ครูใหญ่, หัวหน้าแผนก
            </li>
            <li>
              <b className="text-pink-400">ตาราง teachers</b>:
              ใช้เก็บข้อมูลคุณครู แต่ละคนจะเชื่อมโยงกับตำแหน่งงานในตาราง{" "}
              <code className="text-sm font-mono text-pink-400">positions</code>{" "}
              ผ่าน{" "}
              <code className="text-sm font-mono text-yellow-300">
                position_id
              </code>
            </li>
          </ul>
          <CodeBlock code={sqlCode} language="sql" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
