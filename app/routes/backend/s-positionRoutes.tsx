import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Position Routes" },
    { name: "description", content: "Express.js routes for positions." },
  ];
}

const positionRoutesCode = `import express from 'express';
import {
    getPositions,
    createPosition,
    updatePosition,
    deletePosition
} from '../controllers/positionController.js';

const router = express.Router();

router.get('/', getPositions);
router.post('/', createPosition);
router.put('/:id', updatePosition);
router.delete('/:id', deletePosition);

export default router;`;

export default function PositionRoutesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          การจัดการเส้นทาง (Routes)
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          โค้ดสำหรับไฟล์{" "}
          <code className="text-sm font-mono text-pink-400">
            positionRoutes.js
          </code>{" "}
          ที่ใช้กำหนดเส้นทาง API สำหรับการจัดการข้อมูลตำแหน่ง
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">ตำแหน่งของไฟล์</h2>
          <p className="text-gray-400 mb-4">
            ไฟล์นี้จะอยู่ในโฟลเดอร์{" "}
            <code className="text-sm font-mono text-yellow-300">routes/</code>{" "}
            และจะถูกเรียกใช้ในเราเตอร์หลักของแอปพลิเคชัน
          </p>
          <CodeBlock code={positionRoutesCode} language="javascript" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
