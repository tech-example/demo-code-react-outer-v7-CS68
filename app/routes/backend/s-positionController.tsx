import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Position Controller" },
    {
      name: "description",
      content: "CRUD operations for the positions table.",
    },
  ];
}

const positionControllerCode = `import pool from '../db.js';

// GET all positions
export const getPositions = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM positions');
        res.json({ success: true, data: rows });
    } catch (err) {
        next(err);
    }
};

// CREATE
export const createPosition = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) throw { status: 400, message: 'Name is required' };

        const [result] = await pool.query(
            'INSERT INTO positions (name) VALUES (?)',
            [name]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updatePosition = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) throw { status: 400, message: 'Name is required' };

        await pool.query('UPDATE positions SET name=? WHERE id=?', [name, id]);
        res.json({ success: true, message: 'Updated successfully' });
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deletePosition = async (req, res, next) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM positions WHERE id=?', [id]);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        next(err);
    }
};`;

export default function PositionControllerPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Position Controller
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          ตัวอย่างโค้ดสำหรับสร้าง{" "}
          <code className="text-sm font-mono text-pink-400">Controller</code> ใน
          Express.js เพื่อจัดการการเพิ่ม, ลบ, แก้ไข และดึงข้อมูลจากตาราง{" "}
          <code className="text-sm font-mono text-yellow-300">positions</code>
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            positions.js (หรือ positions.ts)
          </h2>
          <p className="text-gray-400 mb-4">
            โค้ดนี้จะช่วยให้คุณสามารถจัดการข้อมูลตำแหน่งได้อย่างเป็นระบบ
            และสามารถนำไปใช้กับตารางอื่น ๆ ได้อย่างง่ายดาย
          </p>
          <CodeBlock code={positionControllerCode} language="javascript" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
