import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "package.json" },
    { name: "description", content: "Node.js project configuration file." },
  ];
}

const packageJsonCode = `{
  "name": "school-api",
  "version": "1.0.0",
  "description": "Backend API",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "helmet": "^7.0.0",
    "mysql2": "^3.5.2",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`;

export default function PackageJsonPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          การตั้งค่า Package.json
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          ไฟล์{" "}
          <code className="text-sm font-mono text-pink-400">package.json</code>{" "}
          คือหัวใจของโปรเจกต์ Node.js ที่ใช้จัดการข้อมูลเมตา, สคริปต์,
          และไลบรารีที่จำเป็น
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            โครงสร้าง Package.json
          </h2>
          <p className="text-gray-400 mb-4">
            ไฟล์นี้จะระบุ{" "}
            <code className="text-sm font-mono text-yellow-300">
              dependencies
            </code>{" "}
            ที่โปรเจกต์ต้องการและ{" "}
            <code className="text-sm font-mono text-yellow-300">scripts</code>{" "}
            ที่ใช้ในการรันโปรเจกต์ในโหมดต่างๆ
          </p>
          <CodeBlock code={packageJsonCode} language="json" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
