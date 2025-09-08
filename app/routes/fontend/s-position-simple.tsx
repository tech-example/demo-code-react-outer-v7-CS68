import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Code: PositionPage (Simple)" },
    { name: "description", content: "Source code for the simplified PositionPage.tsx." },
  ];
}

// ✨✨✨ โค้ดฉบับสมบูรณ์ของ Position.tsx เวอร์ชัน Simple ถูกเก็บไว้ในตัวแปรนี้ ✨✨✨
const positionSimpleCode = `
import { useState, useEffect } from "react";
import Nav from "~/components/Nav";
import type { Route } from "../+types/root";

// --- Meta ---
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Positions (Simple)" },
    { name: "description", content: "A simplified position management page for beginners." },
  ];
}

// --- Interfaces ---
interface Position {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// --- Main Component ---
export default function PositionPage() {
  // --- State Management ---
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State สำหรับ Modal แก้ไข/สร้าง
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [currentName, setCurrentName] = useState<string>("");

  // State สำหรับ Modal ดูรายละเอียด
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);


  // --- Functions ---
  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/positions");
      const result = await response.json();
      if (result.success) {
        setPositions(result.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = currentId !== null;
    const url = isEditing ? \`http://localhost:5000/positions/\${currentId}\` : "http://localhost:5000/positions";
    const method = isEditing ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: currentName }),
      });
      fetchPositions();
      handleCloseModals();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      try {
        await fetch(\`http://localhost:5000/positions/\${id}\`, { method: "DELETE" });
        fetchPositions();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleOpenCreateModal = () => {
    setCurrentId(null);
    setCurrentName("");
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (position: Position) => {
    setCurrentId(position.id);
    setCurrentName(position.name);
    setIsModalOpen(true);
  };

  const handleOpenDetailModal = (position: Position) => {
    setSelectedPosition(position);
    setIsDetailModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
  };

  // --- Main Render ---
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Nav />
      
      <main className="p-4 sm:p-8">
        <div className="max-w-4xl mx-auto pt-16">
        
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Position Management (Simple)
            </h1>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add New
            </button>
          </div>

          <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-400">Loading...</td>
                  </tr>
                ) : (
                  positions.map((position, index) => (
                    <tr key={position.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-sm">{index + 1}</td>
                      <td className="px-6 py-4 text-sm">{position.name}</td>
                      <td className="px-6 py-4 text-center space-x-4">
                        <button onClick={() => handleOpenDetailModal(position)} className="text-sm font-medium text-green-400 hover:text-green-300">Details</button>
                        <button onClick={() => handleOpenEditModal(position)} className="text-sm font-medium text-blue-400 hover:text-blue-300">Edit</button>
                        <button onClick={() => handleDelete(position.id)} className="text-sm font-medium text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal สำหรับสร้าง/แก้ไข */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4">
              {currentId ? "Edit Position" : "Create Position"}
            </h2>
            <form onSubmit={handleSave}>
              <input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                placeholder="Position Name"
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <div className="flex justify-end space-x-3 mt-2">
                <button type="button" onClick={handleCloseModals} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal สำหรับดูรายละเอียด */}
      {isDetailModalOpen && selectedPosition && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Position Details</h2>
            <div className="space-y-3 text-sm">
              <p><strong className="text-gray-400 w-24 inline-block">Database ID:</strong> {selectedPosition.id}</p>
              <p><strong className="text-gray-400 w-24 inline-block">Name:</strong> {selectedPosition.name}</p>
              <p><strong className="text-gray-400 w-24 inline-block">Created At:</strong> {new Date(selectedPosition.created_at).toLocaleString()}</p>
              <p><strong className="text-gray-400 w-24 inline-block">Updated At:</strong> {new Date(selectedPosition.updated_at).toLocaleString()}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={handleCloseModals} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
`;

export default function PositionSimpleCodePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-600 text-transparent bg-clip-text">
          Position.tsx (Simple Version)
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          โค้ดเวอร์ชันเรียบง่ายของหน้าจัดการข้อมูลตำแหน่ง
          ที่เน้นแก่นการทำงานของ React สำหรับผู้เริ่มต้น
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-cyan-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            หลักการและแนวคิดหลัก
          </h2>
          <p className="text-gray-400 mb-4">
            โค้ดเวอร์ชันนี้ตัดส่วนที่ซับซ้อน เช่น Library Animation ออกไป
            เพื่อให้เห็นการทำงานพื้นฐานของ React ได้อย่างชัดเจน
            เหมาะสำหรับการเรียนรู้และนำไปต่อยอด
          </p>
          <ul className="text-gray-400 mb-6 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-white">State-Driven UI:</strong>{" "}
              แสดงให้เห็นว่า UI (หน้าเว็บ) เปลี่ยนแปลงตามข้อมูลใน State อย่างไร
              เช่น การแสดง/ซ่อน Modal ด้วย State ที่เป็น Boolean (`true`/`false`)
            </li>
            <li>
              <strong className="text-white">Core React Hooks:</strong>{" "}
              โฟกัสที่การใช้งาน Hooks ที่สำคัญคือ{" "}
              <code className="text-sm font-mono text-yellow-300">useState</code>{" "}
              สำหรับจัดการข้อมูล และ{" "}
              <code className="text-sm font-mono text-yellow-300">useEffect</code>{" "}
              สำหรับการดึงข้อมูลเมื่อ Component เริ่มทำงาน
            </li>
            <li>
              <strong className="text-white">Conditional Rendering:</strong>{" "}
              ใช้เงื่อนไข "({"loading ? ... : ..."})" เพื่อแสดงผลหน้าเว็บตามสถานะต่างๆ เช่น
              กำลังโหลด, ไม่มีข้อมูล, หรือแสดงตารางข้อมูล
            </li>
             <li>
              <strong className="text-white">Clean & Functional Code:</strong>{" "}
              โค้ดถูกจัดระเบียบเป็นฟังก์ชันที่ทำหน้าที่เฉพาะอย่างชัดเจน
              ทำให้ง่ายต่อการอ่านและทำความเข้าใจ Logic
            </li>
          </ul>
          <CodeBlock code={positionSimpleCode} language="tsx" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}