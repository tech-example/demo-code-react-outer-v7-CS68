import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Database" },
    { name: "description", content: "Database connection example." },
  ];
}

const dbCode = `import mysql from 'mysql2/promise';

// Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    port: '', // xampp port
    user: 'root',
    password: '',
    database: '', // database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;`;

export default function DatabasePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          การเชื่อมต่อฐานข้อมูล
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          ตัวอย่างโค้ดสำหรับสร้าง Connection Pool ไปยังฐานข้อมูล MySQL ด้วย
          Node.js และไลบรารี mysql2
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            db.js (หรือ db.ts)
          </h2>
          <p className="text-gray-400 mb-4">
            ไฟล์นี้จะทำหน้าที่เป็นโมดูลสำหรับจัดการการเชื่อมต่อฐานข้อมูล
            เพื่อให้สามารถเรียกใช้งานได้จากส่วนอื่น ๆ
            ของแอปพลิเคชันได้อย่างสะดวก
          </p>
          <CodeBlock code={dbCode} language="javascript" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
