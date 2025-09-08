import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Code: TeacherPage" },
    { name: "description", content: "Complete source code for TeacherPage.tsx" },
  ];
}

// ✨✨✨ โค้ดฉบับสมบูรณ์ของ Teacher.tsx เวอร์ชันแก้ไขแล้ว ถูกเก็บไว้ในตัวแปรนี้ ✨✨✨
const teacherCode = `
// Teacher.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "~/components/Nav";
import type { Route } from "../+types/root";
import CustomSelect from "~/components/CustomSelect"; // ตรวจสอบว่า path ถูกต้อง

// --- Interfaces ---
interface Teacher {
  id: number;
  name: string;
  address: string;
  telephone: string;
  img: string;
  position_id: number;
  position_name: string | null; // รับข้อมูลที่ Join แล้วจาก Backend
  created_at: string;
  updated_at: string;
}

// Interface นี้ยังจำเป็นสำหรับ Component CustomSelect ที่ต้องการ options สำหรับ Dropdown
interface Position {
  id: number;
  name: string;
}

interface TeacherFormData {
  name: string;
  address: string;
  telephone: string;
  imgFile: File | null;
  position_id: number;
}

// --- Meta and Constants ---
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teachers" },
    { name: "description", content: "Teacher Management Page" },
  ];
}

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// --- Main Component ---
export default function TeacherPage() {
  // --- State Management ---
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [positions, setPositions] = useState<Position[]>([]); // ยังคง state นี้ไว้สำหรับฟอร์ม (CustomSelect)
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [selectedTeacherForDetail, setSelectedTeacherForDetail] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<TeacherFormData>({
    name: "",
    address: "",
    telephone: "",
    imgFile: null,
    position_id: 0,
  });
  const [imgPreview, setImgPreview] = useState<string>(\`\${API_BASE_URL}/uploads/default.svg\`);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // --- Functions ---
  const showStatusMessage = (type: "success" | "error", message: string) => {
    setStatusMessage({ type, message });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch(\`\${API_BASE_URL}/teachers\`);
      const result = await response.json();
      if (result.success) setTeachers(result.data);
      else showStatusMessage("error", "Failed to fetch teachers.");
    } catch (error) {
      console.error("Fetch error:", error);
      showStatusMessage("error", "Error fetching data from server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch(\`\${API_BASE_URL}/positions\`);
      const result = await response.json();
      if (result.success) setPositions(result.data);
    } catch (error) {
      console.error("Fetch positions error:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchPositions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.position_id === 0) {
        showStatusMessage("error", "Please select a position.");
        return;
    }

    const url = isEditing ? \`\${API_BASE_URL}/teachers/\${currentTeacher?.id}\` : \`\${API_BASE_URL}/teachers\`;
    const method = isEditing ? "PUT" : "POST";
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("address", formData.address);
    formDataToSubmit.append("telephone", formData.telephone);
    formDataToSubmit.append("position_id", formData.position_id.toString());
    if (formData.imgFile) formDataToSubmit.append("img", formData.imgFile);

    try {
      const response = await fetch(url, { method, body: formDataToSubmit });
      const result = await response.json();
      if (result.success) {
        showStatusMessage("success", \`Teacher \${isEditing ? "updated" : "created"}: "\${formData.name}"\`);
        fetchTeachers();
        handleCloseModals();
      } else {
        showStatusMessage("error", \`Failed: \${result.message || 'Unknown error'}\`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      showStatusMessage("error", "Error connecting to the server.");
    }
  };

  const handleDelete = async () => {
    if (!currentTeacher) return;
    try {
      const response = await fetch(\`\${API_BASE_URL}/teachers/\${currentTeacher.id}\`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) {
        showStatusMessage("success", \`Teacher deleted: "\${currentTeacher.name}"\`);
        fetchTeachers();
        handleCloseModals();
      } else {
        showStatusMessage("error", "Failed to delete teacher.");
      }
    } catch (error) {
      console.error("Deletion error:", error);
      showStatusMessage("error", "Error connecting to the server.");
    }
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setCurrentTeacher(null);
    setFormData({ name: "", address: "", telephone: "", imgFile: null, position_id: 0 });
    setImgPreview(\`\${API_BASE_URL}/uploads/default.svg\`);
    setIsModalOpen(true);
  };
  const handleEditClick = (teacher: Teacher) => {
    setIsEditing(true);
    setCurrentTeacher(teacher);
    setFormData({
      name: teacher.name,
      address: teacher.address,
      telephone: teacher.telephone,
      imgFile: null,
      position_id: teacher.position_id,
    });
    setImgPreview(teacher.img ? \`\${API_BASE_URL}\${teacher.img}\` : \`\${API_BASE_URL}/uploads/default.svg\`);
    setIsModalOpen(true);
  };
  const handleDeleteClick = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setIsDeleteModalOpen(true);
  };
  const handleShowDetailClick = (teacher: Teacher) => {
    setSelectedTeacherForDetail(teacher);
    setIsDetailModalOpen(true);
  };
  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsDetailModalOpen(false);
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, imgFile: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImgPreview(currentTeacher?.img ? \`\${API_BASE_URL}\${currentTeacher.img}\` : \`\${API_BASE_URL}/uploads/default.svg\`);
    }
  };

  const renderCards = () => (
    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="visible">
      {teachers.map((teacher) => (
        <motion.div key={teacher.id} className="bg-gray-800/50 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-700/80" variants={cardVariants} whileHover={{ scale: 1.03, y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
          <img src={teacher.img ? \`\${API_BASE_URL}\${teacher.img}\` : \`\${API_BASE_URL}/uploads/default.svg\`} alt={teacher.name} className="w-32 h-32 rounded-full object-cover border-4 border-teal-500/50 mb-4" />
          <h3 className="text-xl font-bold text-gray-100 mb-1">{teacher.name}</h3>
          <p className="text-sm text-teal-400 mb-4">{teacher.position_name || "N/A"}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-auto pt-4">
            <motion.button onClick={() => handleShowDetailClick(teacher)} className="px-3 py-1 text-xs font-semibold text-sky-300 bg-sky-500/10 rounded-full hover:bg-sky-500/20 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={bouncyTransition}>Details</motion.button>
            <motion.button onClick={() => handleEditClick(teacher)} className="px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 rounded-full hover:bg-indigo-500/20 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={bouncyTransition}>Edit</motion.button>
            <motion.button onClick={() => handleDeleteClick(teacher)} className="px-3 py-1 text-xs font-semibold text-red-400 bg-red-500/10 rounded-full hover:bg-red-500/20 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={bouncyTransition}>Delete</motion.button>
          </div>
        </motion.div>
      ))}
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
                    className="w-full max-w-lg bg-slate-900/70 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-slate-700 max-h-[90vh] overflow-y-auto"
                    variants={modalVariants}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );

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
          <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-600 text-transparent bg-clip-text">Teacher Management</h1>
            <motion.button
              onClick={handleCreateClick}
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full shadow-lg shadow-cyan-500/30 transition-all"
              whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
              transition={bouncyTransition}
            >+ Add New Teacher</motion.button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64"><p className="text-xl text-gray-500">Loading...</p></div>
          ) : teachers.length === 0 ? (
            <div className="flex justify-center items-center h-64 bg-gray-800/40 rounded-xl"><p className="text-xl text-gray-500">No teachers found.</p></div>
          ) : (
            renderCards()
          )}
        </div>
      </main>
      
      {renderModalWrapper(isModalOpen, (
        <>
            <h2 className="text-2xl font-bold mb-6 text-gray-100 text-center">{isEditing ? "Edit Teacher" : "Create New Teacher"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center space-y-3">
                    <motion.img src={imgPreview} alt="Preview" className="h-24 w-24 rounded-full object-cover border-4 border-gray-600" whileHover={{ scale: 1.05, rotate: 2 }} transition={bouncyTransition} />
                    <input type="file" id="img" name="img" onChange={handleImgChange} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" accept="image/*" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-400 font-semibold mb-2 text-sm">Name</label>
                        <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                    </div>
                    <div>
                        <label htmlFor="telephone" className="block text-gray-400 font-semibold mb-2 text-sm">Telephone</label>
                        <input type="text" id="telephone" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="address" className="block text-gray-400 font-semibold mb-2 text-sm">Address</label>
                    <textarea id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 h-20" required />
                </div>
                <div>
                    <label className="block text-gray-400 font-semibold mb-2 text-sm">Position</label>
                    <CustomSelect
                        options={positions}
                        value={formData.position_id}
                        onChange={(id) => setFormData({ ...formData, position_id: id })}
                        placeholder="Select a position"
                    />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                    <motion.button type="button" onClick={handleCloseModals} className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={bouncyTransition}>Cancel</motion.button>
                    <motion.button type="submit" className="px-6 py-2 rounded-md text-white bg-cyan-600 hover:bg-cyan-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={bouncyTransition}>{isEditing ? "Save Changes" : "Create"}</motion.button>
                </div>
            </form>
        </>
      ))}

      {renderModalWrapper(isDeleteModalOpen, (
        <>
            <h2 className="text-2xl font-bold mb-4 text-red-500">Confirm Deletion</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete teacher: <strong className="text-white">{currentTeacher?.name}</strong>?</p>
            <div className="flex justify-end space-x-4">
                <motion.button onClick={handleCloseModals} className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={bouncyTransition}>Cancel</motion.button>
                <motion.button onClick={handleDelete} className="px-6 py-2 rounded-md text-white bg-red-600 hover:bg-red-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={bouncyTransition}>Delete</motion.button>
            </div>
        </>
      ))}

      {renderModalWrapper(isDetailModalOpen, (
        <>
            {selectedTeacherForDetail && (
                <div className="flex flex-col items-center text-gray-300">
                    <h2 className="text-2xl font-bold mb-4 text-gray-100">Teacher Details</h2>
                    <motion.img src={selectedTeacherForDetail.img ? \`\${API_BASE_URL}\${selectedTeacherForDetail.img}\` : \`\${API_BASE_URL}/uploads/default.svg\`} alt={selectedTeacherForDetail.name} className="w-40 h-40 rounded-full object-cover border-4 border-teal-500/80 mb-6" whileHover={{ scale: 1.05, rotate: -2 }} transition={bouncyTransition}/>
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-white mb-1">{selectedTeacherForDetail.name}</h3>
                        <p className="text-teal-400">{selectedTeacherForDetail.position_name || "N/A"}</p>
                    </div>
                    <div className="w-full text-left space-y-3 p-4 bg-gray-800/50 rounded-lg">
                        <p><strong className="font-semibold text-gray-400 w-24 inline-block">Address:</strong> {selectedTeacherForDetail.address}</p>
                        <p><strong className="font-semibold text-gray-400 w-24 inline-block">Telephone:</strong> {selectedTeacherForDetail.telephone}</p>
                    </div>
                    <motion.button onClick={handleCloseModals} className="mt-6 px-6 py-2 rounded-md text-white bg-cyan-600 hover:bg-cyan-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={bouncyTransition}>Close</motion.button>
                </div>
            )}
        </>
      ))}
    </div>
  );
}
`;

export default function TeacherCodePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-600 text-transparent bg-clip-text">
          Teacher.tsx
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          ไฟล์ Component หลักสำหรับหน้าจัดการข้อมูลครู (Teacher Management)
          ซึ่งมีความสามารถในการอัปโหลดไฟล์และแสดงผลแบบ Card
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-teal-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            ฟีเจอร์และส่วนประกอบหลัก
          </h2>
          <p className="text-gray-400 mb-4">
            โค้ดนี้แสดงการจัดการข้อมูลในรูปแบบการ์ด (Card Layout) โดยใช้{" "}
            <code className="text-sm font-mono text-pink-400">
              framer-motion
            </code>{" "}
            เพื่อเพิ่ม animation ที่สวยงามและตอบสนองต่อผู้ใช้ได้เป็นอย่างดี
          </p>
          <ul className="text-gray-400 mb-6 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-white">Animated Cards:</strong> การ์ดข้อมูลแต่ละใบจะทยอยปรากฏขึ้นด้วย animation ที่ลื่นไหล โดยใช้{" "}
              <code className="text-sm font-mono text-yellow-300">
                staggerChildren
              </code>
            </li>
            <li>
              <strong className="text-white">Image Upload & Preview:</strong>{" "}
              รองรับการอัปโหลดไฟล์รูปภาพ พร้อมแสดงภาพตัวอย่าง (Preview) ได้ทันทีก่อนบันทึก
            </li>
            <li>
              <strong className="text-white">Glassmorphism Modals:</strong>{" "}
              หน้าต่าง Popup สำหรับสร้าง, แก้ไข, ลบ, และดูรายละเอียด มีลักษณะโปร่งใส (backdrop-blur) ที่สวยงาม
            </li>
            <li>
              <strong className="text-white">Custom Select Component:</strong>{" "}
              ใช้ Dropdown ที่สร้างขึ้นเองพร้อม animation สำหรับเลือกตำแหน่งของครู
            </li>
             <li>
              <strong className="text-white">Dynamic Notifications:</strong> Popup แจ้งเตือนจะแสดงข้อความและสถานะ (Success/Error) ตาม Action ที่ผู้ใช้ทำสำเร็จ
            </li>
          </ul>
          <CodeBlock code={teacherCode} language="tsx" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}