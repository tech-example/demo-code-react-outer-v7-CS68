import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teacher Controller" },
    {
      name: "description",
      content:
        "CRUD operations for the teachers table, including file uploads.",
    },
  ];
}

// ✨✨✨ แก้ไขโค้ดในส่วนนี้ ✨✨✨
const teacherControllerCode = `// teacherController.js
import pool from '../db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET all teachers (เวอร์ชัน Join)
export const getTeachers = async (req, res, next) => {
    try {
        // ใช้ LEFT JOIN เพื่อดึงข้อมูลครูพร้อมชื่อตำแหน่ง
        const query = \`
            SELECT 
                t.*, 
                p.name AS position_name 
            FROM 
                teachers t
            LEFT JOIN 
                positions p ON t.position_id = p.id
        \`;
        const [rows] = await pool.query(query);
        res.json({ success: true, data: rows });
    } catch (err) {
        next(err);
    }
};

// CREATE teacher
export const createTeacher = async (req, res, next) => {
    try {
        const { name, address, telephone, position_id } = req.body;
        // แก้ไข: เก็บ Path เป็น /uploads/filename.jpg
        const img = req.file ? \`/uploads/\${req.file.filename}\` : null;

        if (!name || !address || !telephone || !position_id) {
            throw { status: 400, message: 'Name, address, telephone, and position_id are required' };
        }

        const [result] = await pool.query(
            'INSERT INTO teachers (name, address, telephone, position_id, img) VALUES (?, ?, ?, ?, ?)',
            [name, address, telephone, position_id, img]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        next(err);
    }
};

// UPDATE teacher
export const updateTeacher = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, address, telephone, position_id } = req.body;
        // แก้ไข: เก็บ Path เป็น /uploads/filename.jpg
        const newImgPath = req.file ? \`/uploads/\${req.file.filename}\` : null;

        const [rows] = await pool.query('SELECT img FROM teachers WHERE id = ?', [id]);
        const oldImgPath = rows.length > 0 ? rows[0].img : null;
        
        let query;
        let params;

        if (newImgPath) {
            query = 'UPDATE teachers SET name=?, address=?, telephone=?, position_id=?, img=? WHERE id=?';
            params = [name, address, telephone, position_id, newImgPath, id];
        } else {
            query = 'UPDATE teachers SET name=?, address=?, telephone=?, position_id=? WHERE id=?';
            params = [name, address, telephone, position_id, id];
        }

        await pool.query(query, params);

        if (newImgPath && oldImgPath && oldImgPath !== '/uploads/default.svg') {
            // แก้ไข: ปรับเส้นทางลบไฟล์ให้ชี้ไปที่โฟลเดอร์ uploads ของ backend
            const oldServerFilePath = path.join(__dirname, '..', oldImgPath);
            try {
                await fs.access(oldServerFilePath);
                await fs.unlink(oldServerFilePath);
                console.log(\`Successfully deleted old image file: \${oldServerFilePath}\`);
            } catch (fileErr) {
                console.error(\`Error deleting old image file (might not exist): \${oldServerFilePath}\`, fileErr);
            }
        }

        res.json({ success: true, message: 'Updated successfully' });
    } catch (err) {
        next(err);
    }
};

// DELETE teacher
export const deleteTeacher = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query('SELECT img FROM teachers WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Teacher not found' });
        }
        
        const imgPath = rows[0].img;

        await pool.query('DELETE FROM teachers WHERE id = ?', [id]);

        // แก้ไข: ปรับเส้นทางลบไฟล์ให้ชี้ไปที่โฟลเดอร์ uploads ของ backend
        if (imgPath && imgPath !== '/uploads/default.svg') {
            const serverFilePath = path.join(__dirname, '..', imgPath);
            
            try {
                await fs.access(serverFilePath);
                await fs.unlink(serverFilePath);
                console.log(\`Successfully deleted image file: \${serverFilePath}\`);
            } catch (fileErr) {
                console.error(\`Error deleting image file (might not exist): \${serverFilePath}\`, fileErr);
            }
        }

        res.json({ success: true, message: 'Teacher and associated image deleted successfully' });
    } catch (err) {
        console.error('Error during teacher deletion:', err);
        next(err);
    }
};`;

export default function TeacherControllerPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Teacher Controller
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          ตัวอย่างโค้ดสำหรับสร้าง{" "}
          <code className="text-sm font-mono text-pink-400">Controller</code>{" "}
          เพื่อจัดการข้อมูลครู (teachers) ซึ่งมีการจัดการรูปภาพประกอบด้วย
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
            ไฟล์นี้ประกอบด้วยฟังก์ชันสำหรับดำเนินการ CRUD (Create, Read, Update,
            Delete) กับตาราง{" "}
            <code className="text-sm font-mono text-yellow-300">teachers</code>{" "}
            และยังรวมถึงการจัดการไฟล์รูปภาพที่อัปโหลด
          </p>
          <CodeBlock code={teacherControllerCode} language="javascript" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}