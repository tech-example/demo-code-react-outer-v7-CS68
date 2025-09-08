import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teacher Routes" },
    {
      name: "description",
      content: "Express.js routes for teachers, including file uploads.",
    },
  ];
}

const teacherRoutesCode = `// teacherRoutes.js
import express from 'express';
import {
    getTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher
} from '../controllers/teacherController.js';
import { upload } from '../middleware/upload.js'; // สมมติว่าไฟล์นี้มี multer middleware ที่ถูกต้อง

const router = express.Router();

router.get('/', getTeachers);
router.post('/', upload.single('img'), createTeacher);
router.put('/:id', upload.single('img'), updateTeacher);
router.delete('/:id', deleteTeacher);

export default router;`;

export default function TeacherRoutesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          การจัดการเส้นทาง (Routes) สำหรับครู
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          โค้ดสำหรับไฟล์{" "}
          <code className="text-sm font-mono text-pink-400">
            teacherRoutes.js
          </code>{" "}
          ที่ใช้กำหนดเส้นทาง API สำหรับการจัดการข้อมูลครู
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            การรวม Middleware
          </h2>
          <p className="text-gray-400 mb-4">
            ไฟล์นี้จะใช้{" "}
            <code className="text-sm font-mono text-yellow-300">
              upload.single('img')
            </code>{" "}
            เป็น middleware เพื่อจัดการไฟล์รูปภาพที่อัปโหลดก่อนจะส่งต่อไปยัง
            controller
          </p>
          <CodeBlock code={teacherRoutesCode} language="javascript" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
