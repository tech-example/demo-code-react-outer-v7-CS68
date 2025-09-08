import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Middleware: upload.js" },
    { name: "description", content: "Source code for the Multer upload middleware." },
  ];
}

// โค้ดของ middleware/upload.js จะถูกเก็บไว้ในตัวแปรนี้
const uploadJsCode = `
// middleware/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// กำหนดค่า Multer สำหรับการอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // สร้างโฟลเดอร์ 'uploads' หากยังไม่มี
        const uploadPath = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // สร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำกันโดยใช้วันที่และเวลาปัจจุบัน
        cb(null, \`\${Date.now()}-\${file.originalname}\`);
    }
});

// สร้าง instance ของ multer middleware ด้วยค่า storage ที่กำหนด
const upload = multer({ storage: storage });

// ส่งออก middleware เพื่อให้ไฟล์อื่นนำไปใช้ได้
export { upload };
`;

export default function UploadMiddlewarePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
          Upload Middleware
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          ไฟล์นี้ทำหน้าที่เป็น{" "}
          <code className="text-sm font-mono text-pink-400">Middleware</code>{" "}
          สำหรับจัดการการอัปโหลดไฟล์โดยเฉพาะ โดยใช้ไลบรารีที่ชื่อว่า{" "}
          <code className="text-sm font-mono text-pink-400">Multer</code>
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            โครงสร้างและหน้าที่
          </h2>
          <p className="text-gray-400 mb-4">
            ถ้าหากไฟล์ <code className="text-sm font-mono text-yellow-300">router</code> หลักทำหน้าที่เป็น "ศูนย์กลางกระจายงาน" ไปยัง controller ต่างๆ, 
            ไฟล์ <code className="text-sm font-mono text-yellow-300">upload.js</code> ก็เปรียบเสมือน "แผนกรับพัสดุ" ที่จะเข้ามาจัดการกับไฟล์ที่ถูกส่งมากับ Request ก่อนที่จะส่งข้อมูลต่อไปให้ Controller หลัก
          </p>
          <ul className="text-gray-400 mb-6 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-white">กำหนดที่จัดเก็บ (Destination):</strong> โค้ดจะตรวจสอบว่ามีโฟลเดอร์ชื่อ{" "}
              <code className="text-sm font-mono text-yellow-300">
                uploads
              </code>{" "}
              อยู่หรือไม่ ถ้าไม่มีก็จะสร้างขึ้นมาให้โดยอัตโนมัติ และไฟล์ทั้งหมดจะถูกเก็บไว้ที่นี่
            </li>
            <li>
              <strong className="text-white">กำหนดชื่อไฟล์ (Filename):</strong>{" "}
              เพื่อป้องกันปัญหาชื่อไฟล์ซ้ำกัน โค้ดจะนำวันที่และเวลาปัจจุบัน (Timestamp) มาต่อหน้าชื่อไฟล์เดิม ทำให้ไฟล์ที่อัปโหลดมีชื่อที่ไม่ซ้ำกันแน่นอน
            </li>
            <li>
              <strong className="text-white">ส่งออก Middleware:</strong>{" "}
              สุดท้าย ไฟล์จะทำการ <code className="text-sm font-mono text-yellow-300">export</code> ตัวแปร <code className="text-sm font-mono text-yellow-300">upload</code> ที่ตั้งค่าไว้เรียบร้อยแล้ว เพื่อให้ Routes ที่ต้องการการอัปโหลดไฟล์ (เช่น teacherRoutes) สามารถนำไปใช้งานได้
            </li>
          </ul>
          <CodeBlock code={uploadJsCode} language="javascript" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}