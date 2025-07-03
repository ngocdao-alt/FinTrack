import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import {
  FaUserCircle,
  FaPencilAlt,
  FaSave,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const SettingPage = () => {
  // ------------ STATE ------------
  const [avatar, setAvatar] = useState(null);
  const [userName, setUserName] = useState("Nguyễn Văn A");
  const [editingName, setEditingName] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [theme, setTheme] = useState("light"); // light | dark | system
  const [language, setLanguage] = useState("vi"); // vi | en

  const fileInputRef = useRef(null);

  // ------------ HANDLERS ------------
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));   // xem trước ảnh
  };

  const saveUserName = () => {
    // TODO: call API lưu tên
    setEditingName(false);
  };

  // ------------ RENDER ------------
  return (
    <div className="min-h-screen bg-[#f3f4f6] px-6 py-4 flex flex-col items-center">
      {/* ---------- HEADER ---------- */}


      {/* ---------- CARD ---------- */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md px-6 py-6">
        {/* TITLE */}
        <h2 className="text-xl font-semibold mb-4">Cài đặt</h2> 

        {/* Avatar + icon sửa */}
{/* ---------- Thông tin người dùng ---------- */}
<div className="flex flex-col items-center">
  <h3 className="text-md font-semibold mb-2 text-center">
    Thông tin người dùng
  </h3>

  {/* Avatar + icon bút chì */}
  <div className="relative inline-block mb-4">
    {avatar ? (
      <img
        src={avatar}
        alt="avatar"
        className="h-20 w-20 rounded-full object-cover"
      />
    ) : (
      <FaUserCircle className="h-20 w-20 text-indigo-400" />
    )}
    <button
      onClick={handleAvatarClick}
      className="absolute -bottom-1 -right-1 translate-x-1/4 translate-y-1/4 bg-white p-1 rounded-full shadow hover:bg-gray-100"
      title="Đổi ảnh"
    >
      <FaPencilAlt className="text-sm text-gray-600" />
    </button>
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleAvatarChange}
    />
  </div>
</div>


        {/* Name / Email / Password */}
        <div className="space-y-3">
          {/* Tên */}
          <div className="relative">
            <input
              type="text"
              value={userName}
              readOnly={!editingName}
              onChange={(e) => setUserName(e.target.value)}
              className={`w-full border-b bg-transparent pr-8 ${
                editingName
                  ? "border-indigo-400 focus:outline-none"
                  : "border-gray-400"
              }`}
            />
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600"
              onClick={() =>
                editingName ? saveUserName() : setEditingName(true)
              }
            >
              {editingName ? <FaSave /> : <FaPencilAlt />}
            </button>
          </div>

          {/* Email (không thể sửa) */}
          <input
            type="email"
            value="nguyenvana@gmail.com"
            readOnly
            className="w-full border-b border-gray-400 bg-transparent"
          />

          {/* Password + eye toggle */}
          <div className="relative select-none">
            <input
              type={showPassword ? "text" : "password"}
              value="123456"
              readOnly
              className="w-full border-b border-gray-400 bg-transparent pr-8"
            />
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* --- APPEARANCE --- */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Giao diện</h3>

          {/* Chủ đề */}
          <div className="mb-3">
            <label className="block mb-1">Chủ đề</label>
            <div className="flex space-x-4">
              {["light", "dark", "system"].map((opt) => (
                <label key={opt} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="theme"
                    value={opt}
                    checked={theme === opt}
                    onChange={() => setTheme(opt)}
                  />
                  <span>
                    {opt === "light" ? "Sáng" : opt === "dark" ? "Tối" : "Hệ thống"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Ngôn ngữ */}
          <div className="mb-4">
            <label className="block mb-1">Ngôn ngữ</label>
            <select
              className="w-full border px-3 py-2 rounded-md"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
              
       <Link
  to="/login"
  className="block text-center w-full mt-4 bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600"
>
  Đăng xuất
</Link>

      </div>
    </div>
  );
};

export default SettingPage;
