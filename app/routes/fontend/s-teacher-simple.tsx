import React from "react";
import { motion } from "framer-motion";
import Nav from "~/components/Nav";
import CodeBlock from "~/components/CodeBlock";
import type { Route } from "../../+types/root";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Code: TeacherPage (Simple)" },
    { name: "description", content: "Source code for the simplified TeacherPage.tsx." },
  ];
}

// ✨✨✨ โค้ดฉบับสมบูรณ์ของ Teacher.tsx เวอร์ชัน Simple ถูกเก็บไว้ในตัวแปรนี้ ✨✨✨
const teacherSimpleCode = `
// 💡 1. Imports: นำเข้าเครื่องมือที่จำเป็นจาก React
import { useState, useEffect } from "react";
import Nav from "~/components/Nav";
import type { Route } from "../+types/root";

// --- Meta ---
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teachers (Simple)" },
    { name: "description", content: "A simplified teacher management page." },
  ];
}

// --- Interfaces ---
// 💡 2. Interfaces: กำหนด "พิมพ์เขียว" ของข้อมูลแต่ละชนิด
interface Teacher {
  id: number;
  name: string;
  address: string;
  telephone: string;
  img: string;
  position_id: number;
  position_name: string | null;
}
interface Position {
  id: number;
  name: string;
}

// --- Main Component ---
export default function TeacherPage() {
  // --- State Management ---
  // 💡 3. State: "กล่องเก็บข้อมูล" ที่เมื่อเปลี่ยนค่าจะทำให้หน้าเว็บอัปเดตตาม
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State สำหรับควบคุม Modal (Popup)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // State สำหรับเก็บข้อมูลในฟอร์ม และ Teacher ที่ถูกเลือก
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  
  // State สำหรับข้อมูลฟอร์มและรูปภาพตัวอย่าง
  const [formData, setFormData] = useState({ name: "", address: "", telephone: "", position_id: 0 });
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>("/uploads/default.svg");

  // --- Functions ---
  // 💡 4. Functions: กลุ่มคำสั่งที่ทำงานเมื่อถูกเรียกใช้

  const API_BASE_URL = "http://localhost:5000";

  // ดึงข้อมูลครู (ที่ Join กับตำแหน่งแล้ว)
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch(\`\${API_BASE_URL}/teachers\`);
      const result = await response.json();
      if (result.success) setTeachers(result.data);
    } catch (error) {
      console.error("Fetch teachers error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลตำแหน่งทั้งหมด (สำหรับใช้ใน Dropdown)
  const fetchPositions = async () => {
    try {
      const response = await fetch(\`\${API_BASE_URL}/positions\`);
      const result = await response.json();
      if (result.success) setPositions(result.data);
    } catch (error) {
      console.error("Fetch positions error:", error);
    }
  };

  // useEffect ทำงานครั้งเดียวตอนหน้าเว็บโหลดเสร็จ
  useEffect(() => {
    fetchTeachers();
    fetchPositions();
  }, []);

  // จัดการเมื่อมีการเลือกไฟล์รูปภาพ
  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgFile(file); // เก็บไฟล์ที่เลือกไว้ใน State
      // สร้าง URL ชั่วคราวสำหรับแสดงภาพตัวอย่าง
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // จัดการการ "บันทึก" ข้อมูล (สร้างใหม่และแก้ไข)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // FormData เป็นวิธีมาตรฐานในการส่งข้อมูลและ "ไฟล์" ไปยัง Backend
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("address", formData.address);
    formDataToSubmit.append("telephone", formData.telephone);
    formDataToSubmit.append("position_id", formData.position_id.toString());
    if (imgFile) {
      formDataToSubmit.append("img", imgFile);
    }

    const url = isEditing ? \`\${API_BASE_URL}/teachers/\${currentTeacher?.id}\` : \`\${API_BASE_URL}/teachers\`;
    const method = isEditing ? "PUT" : "POST";

    try {
      await fetch(url, { method, body: formDataToSubmit });
      fetchTeachers();
      handleCloseModals();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  // จัดการการ "ลบ" ข้อมูล
  const handleDelete = async (teacherId: number) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await fetch(\`\${API_BASE_URL}/teachers/\${teacherId}\`, { method: "DELETE" });
        fetchTeachers();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  // --- Modal Handlers ---
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentTeacher(null);
    setFormData({ name: "", address: "", telephone: "", position_id: 0 });
    setImgFile(null);
    setImgPreview(\`\${API_BASE_URL}/uploads/default.svg\`);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (teacher: Teacher) => {
    setIsEditing(true);
    setCurrentTeacher(teacher);
    setFormData({
      name: teacher.name,
      address: teacher.address,
      telephone: teacher.telephone,
      position_id: teacher.position_id,
    });
    setImgFile(null);
    setImgPreview(teacher.img ? \`\${API_BASE_URL}\${teacher.img}\` : \`\${API_BASE_URL}/uploads/default.svg\`);
    setIsModalOpen(true);
  };
  
  const handleOpenDetailModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
  };

  // --- Main Render ---
  // 💡 5. Return (JSX): ส่วนกำหนดหน้าตาของเว็บ
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Nav />
      <main className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto pt-16">
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Teacher Management (Simple)</h1>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add New Teacher
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="bg-gray-800 rounded-lg shadow-md p-5 flex flex-col text-center items-center">
                  <img
                    src={teacher.img ? \`\${API_BASE_URL}\${teacher.img}\` : \`\${API_BASE_URL}/uploads/default.svg\`}
                    alt={teacher.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-600 mb-4"
                  />
                  <h3 className="text-lg font-bold">{teacher.name}</h3>
                  <p className="text-sm text-blue-400 mb-4">{teacher.position_name || "N/A"}</p>
                  
                  <div className="flex flex-wrap justify-center gap-4 mt-auto pt-4">
                    <button onClick={() => handleOpenDetailModal(teacher)} className="text-sm font-medium text-green-400 hover:text-green-300">Details</button>
                    <button onClick={() => handleOpenEditModal(teacher)} className="text-sm font-medium text-blue-400 hover:text-blue-300">Edit</button>
                    <button onClick={() => handleDelete(teacher.id)} className="text-sm font-medium text-red-400 hover:text-red-300">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal สำหรับสร้าง/แก้ไข */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Teacher" : "Create Teacher"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center">
                <img src={imgPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-gray-600 mx-auto mb-4" />
                <input type="file" name="img" onChange={handleImgChange} accept="image/*" className="text-sm" />
              </div>
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" required />
              <textarea placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" required />
              <input type="text" placeholder="Telephone" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" required />
              
              <select
                value={formData.position_id}
                onChange={(e) => setFormData({ ...formData, position_id: Number(e.target.value) })}
                className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
                required
              >
                <option value={0} disabled>-- Select a position --</option>
                {positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={handleCloseModals} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal สำหรับดูรายละเอียด */}
      {isDetailModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Teacher Details</h2>
            <div className="text-center">
                <img src={selectedTeacher.img ? \`\${API_BASE_URL}\${selectedTeacher.img}\` : \`\${API_BASE_URL}/uploads/default.svg\`} alt={selectedTeacher.name} className="w-32 h-32 rounded-full object-cover border-4 border-gray-600 mx-auto mb-4" />
            </div>
            <div className="space-y-2 text-sm">
              <p><strong className="text-gray-400 w-24 inline-block">Name:</strong> {selectedTeacher.name}</p>
              <p><strong className="text-gray-400 w-24 inline-block">Position:</strong> {selectedTeacher.position_name}</p>
              <p><strong className="text-gray-400 w-24 inline-block">Address:</strong> {selectedTeacher.address}</p>
              <p><strong className="text-gray-400 w-24 inline-block">Telephone:</strong> {selectedTeacher.telephone}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={handleCloseModals} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

export default function TeacherSimpleCodePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <Nav />
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-600 text-transparent bg-clip-text">
          Teacher.tsx (Simple Version)
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          โค้ดเวอร์ชันเรียบง่ายของหน้าจัดการข้อมูลครู
          ที่เน้น Logic การทำงานพื้นฐานของ React
          โดยเฉพาะการจัดการฟอร์มที่มีการอัปโหลดไฟล์
        </p>
        <motion.div
          className="p-6 rounded-xl border-t-4 border-b-4 border-teal-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            หลักการและแนวคิดหลัก
          </h2>
          <p className="text-gray-400 mb-4">
            โค้ดนี้ตัดความซับซ้อนด้าน Animation ออกไปทั้งหมด
            เพื่อให้เห็นแก่นการทำงานของ React ในการสร้างหน้า CRUD
            ที่สมบูรณ์แบบได้ชัดเจนขึ้น
          </p>
          <ul className="text-gray-400 mb-6 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-white">File Upload & Preview:</strong>{" "}
              แสดงวิธีการจัดการ <code className="text-sm font-mono text-yellow-300">{"<input type='file'>"}</code>,
              แสดงภาพตัวอย่างด้วย <code className="text-sm font-mono text-yellow-300">FileReader</code>,
              และส่งข้อมูลไฟล์ด้วย <code className="text-sm font-mono text-yellow-300">FormData</code>
            </li>
            <li>
              <strong className="text-white">State-Driven UI:</strong>{" "}
              UI ทั้งหมดถูกควบคุมด้วย State ของ React ตั้งแต่การแสดง Card,
              ข้อมูลในฟอร์ม, ไปจนถึงการเปิด/ปิดหน้าต่าง Popup
            </li>
            <li>
              <strong className="text-white">Card-Based Layout:</strong>{" "}
              ใช้ Grid Layout ของ Tailwind CSS
              ในการแสดงผลข้อมูลเป็นรูปแบบการ์ดที่ตอบสนองตามขนาดหน้าจอ (Responsive)
            </li>
             <li>
              <strong className="text-white">Basic Form Elements:</strong>{" "}
              ใช้ Element พื้นฐานของ HTML เช่น <code className="text-sm font-mono text-yellow-300">{"<select>"}</code>{" "}
              เพื่อให้โค้ดเบาและเข้าใจง่ายสำหรับผู้เริ่มต้น
            </li>
          </ul>
          <CodeBlock code={teacherSimpleCode} language="tsx" />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}