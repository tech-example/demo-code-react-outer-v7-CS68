import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Error Handling" },
    { name: "description", content: "Express.js error handler middleware." },
  ];
}

const errorHandlerCode = `export const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message || err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};`;

export default function ErrorHandlerPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          การจัดการข้อผิดพลาด (Error Handling)
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          โค้ดสำหรับสร้าง Global Error Handler Middleware
          เพื่อดักจับและจัดการข้อผิดพลาดที่เกิดขึ้นในเซิร์ฟเวอร์
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            errorHandler.js (หรือ errorHandler.ts)
          </h2>
          <p className="text-gray-400 mb-4">
            Middleware นี้จะถูกเรียกใช้เมื่อเกิดข้อผิดพลาดใด ๆ ใน Express.js
            โดยจะส่งรหัสสถานะและข้อความกลับไปเพื่อให้ Client
            ทราบถึงปัญหาที่เกิดขึ้น
          </p>
          <CodeBlock code={errorHandlerCode} language="javascript" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
