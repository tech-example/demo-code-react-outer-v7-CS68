import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Default SVG" },
    { name: "description", content: "Default profile image SVG icon." },
  ];
}

const defaultSvgCode = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>`;

export default function DefaultSvgPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Default Profile SVG
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          โค้ดสำหรับไฟล์{" "}
          <code className="text-sm font-mono text-pink-400">default.svg</code>{" "}
          ซึ่งเป็น SVG icon ที่ใช้เป็นรูปภาพโปรไฟล์เริ่มต้น
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            โครงสร้างและ Logic
          </h2>
          <p className="text-gray-400 mb-4">
            โค้ดนี้สร้าง React Component ที่สามารถนำไปใช้เป็น SVG icon
            สำหรับรูปโปรไฟล์ที่ไม่มีภาพในฐานข้อมูล
          </p>
          <CodeBlock code={defaultSvgCode} language="xml" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
