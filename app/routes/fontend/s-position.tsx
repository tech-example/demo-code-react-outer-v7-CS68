import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Code: PositionPage" },
    { name: "description", content: "Complete source code for PositionPage.tsx with animations." },
  ];
}

// ✨✨✨ โค้ดฉบับสมบูรณ์ของ Position.tsx เวอร์ชันล่าสุด ถูกเก็บไว้ในตัวแปรนี้ ✨✨✨
const positionCode = `
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "~/components/Nav";
import type { Route } from "../+types/root";

// --- Meta ---
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Positions" },
    { name: "description", content: "Position Management Page" },
  ];
}

// --- Interfaces ---
interface Position {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
interface FormState {
  id: number | null;
  name: string;
}

// --- Constants ---
const API_BASE_URL = "http://localhost:5000";

// --- Animation Variants ---
const bouncyTransition = {
  type: 'spring',
  stiffness: 500,
  damping: 10,
};

const modalVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ...bouncyTransition, duration: 0.2 } },
  exit: { y: -50, opacity: 0, transition: { duration: 0.2 } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const statusMessageVariants = {
  hidden: { opacity: 0, y: -100 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100, transition: { duration: 0.2 } },
};

// --- Main Component ---
export default function PositionPage() {
  // --- State Management ---
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const [currentPosition, setCurrentPosition] = useState<FormState>({ id: null, name: "" });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // --- Functions ---
  const showStatusMessage = (type: "success" | "error", message: string) => {
    setStatusMessage({ type, message });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await fetch(\`\${API_BASE_URL}/positions\`);
      const result = await response.json();
      if (result.success) {
        setPositions(result.data);
      } else {
        showStatusMessage("error", "Failed to fetch positions.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showStatusMessage("error", "Error fetching data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? \`\${API_BASE_URL}/positions/\${currentPosition.id}\` : \`\${API_BASE_URL}/positions\`;
    const method = isEditing ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: currentPosition.name }),
      });
      const result = await response.json();
      if (result.success) {
        showStatusMessage("success", \`Position \${isEditing ? "updated" : "created"}: "\${currentPosition.name}"\`);
        fetchPositions();
        setIsModalOpen(false);
      } else {
        showStatusMessage("error", \`Failed to \${isEditing ? "update" : "create"} position.\`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      showStatusMessage("error", "Error connecting to the server.");
    }
  };

  const handleDelete = async () => {
    if (currentPosition.id === null) return;
    try {
      const response = await fetch(\`\${API_BASE_URL}/positions/\${currentPosition.id}\`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        showStatusMessage("success", \`Position deleted: "\${currentPosition.name}"\`);
        fetchPositions();
        setIsDeleteModalOpen(false);
      } else {
        showStatusMessage("error", "Failed to delete position.");
      }
    } catch (error) {
      console.error("Deletion error:", error);
      showStatusMessage("error", "Error connecting to the server.");
    }
  };

  // --- UI Event Handlers ---
  const handleCreateClick = () => {
    setIsEditing(false);
    setCurrentPosition({ id: null, name: "" });
    setIsModalOpen(true);
  };
  const handleEditClick = (position: Position) => {
    setIsEditing(true);
    setCurrentPosition({ id: position.id, name: position.name });
    setIsModalOpen(true);
  };
  const handleDeleteClick = (position: Position) => {
    setCurrentPosition({ id: position.id, name: position.name });
    setIsDeleteModalOpen(true);
  };
  
  const handleDetailClick = (position: Position) => {
    setSelectedPosition(position);
    setIsDetailModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsDetailModalOpen(false);
  };

  // --- Render Functions ---
  const renderTable = () => (
    <motion.div
      className="bg-gray-800/50 shadow-lg rounded-xl overflow-hidden border border-gray-700/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {["No.", "Name", "Actions"].map((header) => (
              <th key={header} scope="col" className={\`px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider \${header === 'Actions' ? 'text-center' : 'text-left'}\`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <motion.tbody
          className="bg-gray-900/10 divide-y divide-gray-700"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden"
          animate="visible"
        >
          {positions.map((position, index) => (
            <motion.tr
              key={position.id}
              className="hover:bg-gray-800/60 transition-colors duration-150"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{position.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <motion.button
                  onClick={() => handleDetailClick(position)}
                  className="px-3 py-1 text-xs font-semibold text-sky-300 bg-sky-500/10 rounded-full hover:bg-sky-500/20 transition-colors"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={bouncyTransition}
                >Details</motion.button>
                <motion.button
                  onClick={() => handleEditClick(position)}
                  className="px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 rounded-full hover:bg-indigo-500/20 transition-colors"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={bouncyTransition}
                >Edit</motion.button>
                <motion.button
                  onClick={() => handleDeleteClick(position)}
                  className="px-3 py-1 text-xs font-semibold text-red-400 bg-red-500/10 rounded-full hover:bg-red-500/20 transition-colors"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={bouncyTransition}
                >Delete</motion.button>
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </motion.div>
  );

  const renderModalWrapper = (isOpen: boolean, children: React.ReactNode) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          variants={backdropVariants}
          initial="hidden" animate="visible" exit="exit"
          onClick={handleCloseModals}
        >
          <motion.div
            className="w-full max-w-md bg-slate-900/70 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-slate-700"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Nav />
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100]">
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              className={\`flex items-center gap-3 mb-4 px-5 py-3 rounded-xl text-white font-semibold shadow-lg \${statusMessage.type === "success" ? "bg-green-500/90" : "bg-red-500/90"} backdrop-blur-sm border border-white/20\`}
              variants={statusMessageVariants} initial="hidden" animate="visible" exit="exit"
            >
              <span className="text-lg">{statusMessage.type === 'success' ? '✓' : '✗'}</span>
              {statusMessage.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
              Position Management
            </h1>
            <motion.button
              onClick={handleCreateClick}
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg shadow-blue-500/30 transition-all"
              whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} transition={bouncyTransition}
            >+ Add New Position</motion.button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64"><p className="text-xl text-gray-500">Loading...</p></div>
          ) : positions.length === 0 ? (
            <div className="flex justify-center items-center h-64 bg-gray-800/40 rounded-xl"><p className="text-xl text-gray-500">No positions found.</p></div>
          ) : (
            renderTable()
          )}
        </div>
      </main>

      {renderModalWrapper(isModalOpen, (
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-100">{isEditing ? "Edit Position" : "Create New Position"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-400 font-semibold mb-2">Position Name</label>
              <input
                type="text"
                id="name"
                value={currentPosition.name}
                onChange={(e) => setCurrentPosition({ ...currentPosition, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <motion.button type="button" onClick={handleCloseModals} className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={bouncyTransition}>Cancel</motion.button>
              <motion.button type="submit" className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={bouncyTransition}>{isEditing ? "Save Changes" : "Create"}</motion.button>
            </div>
          </form>
        </>
      ))}

      {renderModalWrapper(isDeleteModalOpen, (
        <>
          <h2 className="text-2xl font-bold mb-4 text-red-500">Confirm Deletion</h2>
          <p className="text-gray-300 mb-6">Are you sure you want to delete position: <strong className="text-white">{currentPosition.name}</strong>?</p>
          <div className="flex justify-end space-x-4">
            <motion.button onClick={handleCloseModals} className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={bouncyTransition}>Cancel</motion.button>
            <motion.button onClick={handleDelete} className="px-6 py-2 rounded-md text-white bg-red-600 hover:bg-red-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={bouncyTransition}>Delete</motion.button>
          </div>
        </>
      ))}

      {renderModalWrapper(isDetailModalOpen, (
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Position Details</h2>
          {selectedPosition && (
            <div className="space-y-3 text-gray-300">
              <p><strong className="font-semibold text-gray-400 w-28 inline-block">Database ID:</strong> {selectedPosition.id}</p>
              <p><strong className="font-semibold text-gray-400 w-28 inline-block">Name:</strong> {selectedPosition.name}</p>
              <p><strong className="font-semibold text-gray-400 w-28 inline-block">Created At:</strong> {new Date(selectedPosition.created_at).toLocaleString('en-GB')}</p>
              <p><strong className="font-semibold text-gray-400 w-28 inline-block">Updated At:</strong> {new Date(selectedPosition.updated_at).toLocaleString('en-GB')}</p>
            </div>
          )}
          <div className="flex justify-end mt-8">
            <motion.button onClick={handleCloseModals} className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={bouncyTransition}>Close</motion.button>
          </div>
        </>
      ))}
    </div>
  );
}
`;

export default function PositionCodePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Position.tsx
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          ไฟล์ Component หลักสำหรับหน้าจัดการข้อมูลตำแหน่ง (Position Management)
          เวอร์ชันสมบูรณ์พร้อม Animation และฟังก์ชันการทำงานครบครัน
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            ฟีเจอร์และส่วนประกอบหลัก
          </h2>
          <p className="text-gray-400 mb-4">
            โค้ดนี้ได้เพิ่มความสามารถในการดูรายละเอียดข้อมูล (Details)
            และปรับปรุงการแสดงผลในตารางให้กระชับขึ้น
            โดยยังคงใช้ความสามารถของ{" "}
            <code className="text-sm font-mono text-pink-400">
              framer-motion
            </code>{" "}
            อย่างเต็มรูปแบบ
          </p>
          <ul className="text-gray-400 mb-6 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-white">Details Modal:</strong>{" "}
              เพิ่มปุ่มและหน้าต่าง Popup สำหรับแสดงข้อมูลทั้งหมดของตำแหน่งงาน
              รวมถึงเวลาที่สร้างและอัปเดตล่าสุด
            </li>
            <li>
              <strong className="text-white">Clean Table Layout:</strong>{" "}
              นำคอลัมน์ที่ไม่จำเป็นออกจากตารางหลัก (Created At, Updated At)
              เพื่อให้แสดงผลได้กระชับและดูง่ายขึ้น
            </li>
            <li>
              <strong className="text-white">Row Indexing:</strong>{" "}
              เปลี่ยนการแสดงผล ID ของฐานข้อมูลเป็นการแสดงลำดับที่ (1, 2, 3,...)
              เพื่อให้ผู้ใช้เข้าใจง่าย
            </li>
            <li>
              <strong className="text-white">Animated Components:</strong>{" "}
              ยังคงใช้ Animation สำหรับตาราง, Modals, ปุ่ม, และการแจ้งเตือน
              เพื่อประสบการณ์การใช้งานที่ดี
            </li>
          </ul>
          <CodeBlock code={positionCode} language="tsx" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}
