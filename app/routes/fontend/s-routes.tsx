import React from "react";
import { motion } from "framer-motion";
import CodeBlock from "~/components/CodeBlock";
import Nav from "~/components/Nav";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router Routes" },
    {
      name: "description",
      content: "Route configuration for the application using React Router v7.",
    },
  ];
}

const routesCode = `import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/teachers", "routes/teacher.tsx"),
    route("/positions", "routes/position.tsx")
] satisfies RouteConfig;`;

export default function RoutesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          การตั้งค่าเส้นทาง (Routes)
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          โค้ดสำหรับไฟล์{" "}
          <code className="text-sm font-mono text-pink-400">s-routes.tsx</code>{" "}
          เพื่อกำหนดเส้นทางของหน้าต่างๆ ในแอปพลิเคชัน
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">รายละเอียดโค้ด</h2>
          <p className="text-gray-400 mb-4">
            โค้ดนี้ใช้ฟังก์ชัน{" "}
            <code className="text-sm font-mono text-yellow-300">index</code> และ{" "}
            <code className="text-sm font-mono text-yellow-300">route</code>{" "}
            จากไลบรารีของ React Router v7 เพื่อสร้างออบเจกต์การตั้งค่าเส้นทาง
          </p>
          <ul className="text-gray-400 mb-6 space-y-2 list-disc list-inside">
            <li>
              <code className="text-sm font-mono text-yellow-300">
                index("routes/home.tsx")
              </code>
              : กำหนดหน้าแรกของแอปพลิเคชันที่เส้นทางหลัก (
              <code className="text-sm font-mono text-pink-400">/</code>)
              โดยใช้คอมโพเนนต์จากไฟล์{" "}
              <code className="text-sm font-mono text-pink-400">home.tsx</code>
            </li>
            <li>
              <code className="text-sm font-mono text-yellow-300">
                route("/teachers", "routes/teacher.tsx")
              </code>
              : กำหนดเส้นทางสำหรับหน้า "Teachers" ที่ URL{" "}
              <code className="text-sm font-mono text-pink-400">/teachers</code>
            </li>
            <li>
              <code className="text-sm font-mono text-yellow-300">
                route("/positions", "routes/position.tsx")
              </code>
              : กำหนดเส้นทางสำหรับหน้า "Positions" ที่ URL{" "}
              <code className="text-sm font-mono text-pink-400">
                /positions
              </code>
            </li>
          </ul>
          <CodeBlock code={routesCode} language="tsx" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
