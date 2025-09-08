import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Main Router" },
    { name: "description", content: "Main Express router setup." },
  ];
}

const routerCode = `import express from 'express';
import positionRoutes from './positionRoutes.js';
import teacherRoutes from './teacherRoutes.js';

const router = express.Router();

// Main routes
router.use('/positions', positionRoutes);
router.use('/teachers', teacherRoutes);

export default router;`;

export default function RouterPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          การจัดการเราเตอร์หลัก
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          ตัวอย่างโค้ดสำหรับสร้างเราเตอร์หลักใน Express.js
          เพื่อแยกการจัดการเส้นทางตามแต่ละส่วนของแอปพลิเคชัน
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            index.js (หรือ index.ts)
          </h2>
          <p className="text-gray-400 mb-4">
            โค้ดนี้จะช่วยให้คุณสามารถเพิ่มเส้นทางใหม่ ๆ
            ได้อย่างง่ายดายและเป็นระบบมากขึ้น
          </p>
          <CodeBlock code={routerCode} language="javascript" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
