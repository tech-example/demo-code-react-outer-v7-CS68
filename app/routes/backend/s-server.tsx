import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Server Main File" },
    { name: "description", content: "Main Express server setup file." },
  ];
}

const serverCode = `// server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import dotenv from 'dotenv';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import multer from 'multer';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Multer Configuration for File Uploads ----------
// ตั้งค่า Multer เพื่อกำหนดที่เก็บไฟล์ในโฟลเดอร์ 'uploads' ของ Backend
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({ storage: storage });

// ---------- Middleware ----------
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// ---------- Static Files ----------
// Middleware นี้จะทำให้สามารถเรียกดูไฟล์ในโฟลเดอร์ 'uploads' ได้ผ่าน URL /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- Routes ----------
app.use('/', router);

// ... (ส่วนอื่นๆ ของโค้ดเดิม)
// ---------- Health Check ----------
app.get('/health', (req, res) => {
    res.json({ status: 'OK', env: NODE_ENV, time: new Date().toISOString() });
});

// ---------- 404 Handler ----------
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: \`Not Found - \${req.originalUrl}\`
    });
});

// ---------- Error Handler ----------
app.use(errorHandler);

// ---------- Start Server ----------
app.listen(PORT, () => {
    const url = \`http://localhost:\${PORT}\`;
    console.log(\`\\n✅ Server running in \${NODE_ENV} mode\`);
    console.log(\`🌐 Health check: \${url}/health\`);
    console.log(\`💻 Positions: \${url}/positions\`);
    console.log(\`💻 Teachers: \${url}/teachers\\n\`);
});
`;

export default function ServerPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          การตั้งค่า Server หลัก
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          ไฟล์{" "}
          <code className="text-sm font-mono text-pink-400">server.js</code>{" "}
          คือไฟล์หลักที่ใช้ในการรันและตั้งค่า Express.js Server
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            โครงสร้างและ Middleware
          </h2>
          <p className="text-gray-400 mb-4">
            โค้ดนี้แสดงการนำเข้าและใช้งานไลบรารีต่างๆ เช่น{" "}
            <code className="text-sm font-mono text-yellow-300">express</code>,{" "}
            <code className="text-sm font-mono text-yellow-300">cors</code>,{" "}
            <code className="text-sm font-mono text-yellow-300">morgan</code>,
            และอื่นๆ
          </p>
          <CodeBlock code={serverCode} language="javascript" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
