import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserCircle,
  FaCamera,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaHome,
  FaThLarge,
  FaWallet,
  FaChartLine,
  FaChartPie,
  FaCog,
  FaPen,
  FaGlobe,
} from 'react-icons/fa';

const SettingPage = () => {
  // ------------ STATE ------------
  const [avatar, setAvatar] = useState(null);
  const [userName, setUserName] = useState('Nguyễn Văn A');
  const [editingName, setEditingName] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [theme, setTheme] = useState('light');    // light | dark | system
  const [language, setLanguage] = useState('vi'); // vi | en

  const fileInputRef = useRef(null);

  // ------------ HANDLERS ------------
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file)); // xem trước ảnh
  };

  const saveUserName = () => setEditingName(false); // TODO: call API để lưu

  // ------------ RENDER ------------
  return (
    <div className="min-h-screen flex bg-[#f3f4f6]">
      {/* ---------- SIDEBAR ---------- */}
     

      {/* ---------- MAIN ---------- */}
      <main className="flex-1 px-4 sm:px-6 py-6 flex justify-center">
  <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6">
    <h2 className="text-2xl font-semibold mb-8">Cài đặt</h2>

    <div className="flex flex-col md:flex-row gap-10 items-start">
      {/* ===== LEFT: Thông tin người dùng ===== */}
      <section className="flex-1">
        <h3 className="text-lg font-semibold mb-4">Thông tin người dùng</h3>

        {/* Avatar với overlay */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative inline-block h-24 w-24 group cursor-pointer">
           {avatar ? (
  <img
    src={avatar}
    alt="avatar"
    className="h-full w-full rounded-full object-cover"
  />
) : (
  <div className="h-full w-full rounded-full overflow-hidden relative">
    {/* Nửa trên: xanh nhạt */}
    <div className="absolute top-0 left-0 w-full h-1/2 bg-[#c7ccff]" />
    {/* Nửa dưới: xám đậm */}
    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#3c3c3c]" />
    {/* Icon hình ảnh */}
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM5 5h14v7.586l-2.293-2.293a1 1 0 0 0-1.414 0L11 14l-2.293-2.293a1 1 0 0 0-1.414 0L5 14.586V5Zm0 14v-1.586l4-4 2.293 2.293a1 1 0 0 0 1.414 0L17 12.414l4 4V19H5Z" />
      </svg>
    </div>
  </div>
)}


            {/* INPUT ẩn */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            {/* OVERLAY khi hover */}
            <div
              onClick={handleAvatarClick}
              className="absolute inset-0 flex items-center justify-center
                         bg-black/50 rounded-full text-white opacity-0
                         group-hover:opacity-100 transition-opacity"
              title="Đổi ảnh"
            >
              <FaCamera className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Trường dữ liệu */}
        <div className="space-y-5">
          {/* Tên */}
          <div className="relative">
            <input
              type="text"
              value={userName}
              readOnly={!editingName}
              onChange={(e) => setUserName(e.target.value)}
              className={`w-full border-b bg-transparent pr-8 ${
                editingName ? 'border-indigo-400 focus:outline-none' : 'border-gray-400'
              }`}
            />
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600"
              onClick={() => (editingName ? saveUserName() : setEditingName(true))}
              title={editingName ? 'Lưu tên' : 'Chỉnh sửa tên'}
            >
              {editingName ? <FaSave /> : <FaPen />} {/* cây bút */}
            </button>
          </div>

          {/* Email */}
          <input
            type="email"
            value="nguyenvana@gmail.com"
            readOnly
            className="w-full border-b border-gray-400 bg-transparent"
          />

          {/* Password */}
          <div className="relative select-none">
            <input
              type={showPassword ? 'text' : 'password'}
              value="123456"
              readOnly
              className="w-full border-b border-gray-400 bg-transparent pr-8"
            />
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600"
              onClick={() => setShowPassword((s) => !s)}
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      </section>

      {/* ===== VERTICAL DIVIDER ===== */}
      <div className="hidden md:block w-px bg-gray-300 self-stretch"></div>

      {/* ===== RIGHT: Tuỳ chọn giao diện ===== */}
      <section className="flex-1 mt-10 md:mt-0">
        

        {/* Chủ đề */}
        <div className="mb-6">
         <h3 className="text-lg font-semibold mb-4">Giao diện</h3>
          <label className="block mb-2 font-medium">Chủ đề</label>
          <div className="flex space-x-6">
            {['light', 'dark', 'system'].map((opt) => (
              <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value={opt}
                  checked={theme === opt}
                  onChange={() => setTheme(opt)}
                />
                <span>{opt === 'light' ? 'Sáng' : opt === 'dark' ? 'Tối' : 'Hệ thống'}</span>
              </label>
            ))}
          </div>
        </div>
            <div className="mb-6">
          <label className="flex items-center space-x-2 mb-2 font-medium cursor-pointer">
            
            <span>Ngôn ngữ</span><FaGlobe />
          </label>
          <select
            className="w-full border px-3 py-2 rounded-md"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
        {/* Nút Đăng xuất */}
        <Link
          to="/login"
          className="block text-center w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition-colors"
        >
          Đăng xuất
        </Link>
      </section>
    </div>
    </div>
  </main>

    </div>
  );
};

export default SettingPage;
