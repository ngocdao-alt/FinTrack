import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaCamera,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaPen,
  FaGlobe,
  FaPencilAlt,
} from "react-icons/fa";

const SettingPage = () => {
  const [avatar, setAvatar] = useState(null);
  const [userName, setUserName] = useState("Nguyễn Văn A");
  const [editingName, setEditingName] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("vi");

  const fileInputRef = useRef(null);

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };
  const saveUserName = () => setEditingName(false); // TODO: call API

  return (
    <div className="min-h-screen flex bg-[#f3f4f6]">
      <main className="flex-1 px-4 sm:px-6 py-6 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-8">Cài đặt</h2>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* === Thông tin người dùng === */}
            <section className="flex-1">
              <h3 className="text-lg font-semibold mb-4">
                Thông tin người dùng
              </h3>

              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group h-24 w-24 cursor-pointer">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#c7ccff]" />
                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#3c3c3c]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaUserCircle className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Overlay khi hover */}
                  <div
                    onClick={handleAvatarClick}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Đổi ảnh"
                  >
                    <FaCamera className="text-2xl" />
                  </div>

                  {/* Icon chỉnh sửa */}
                  <button
                    onClick={handleAvatarClick}
className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                    title="Đổi ảnh"
                  >
                    <FaPencilAlt className="text-sm text-gray-600" />
                  </button>

                  {/* Input upload ẩn */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              {/* Tên, Email, Mật khẩu */}
              <div className="space-y-5">
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
                    title={editingName ? "Lưu tên" : "Chỉnh sửa tên"}
                  >
                    {editingName ? <FaSave /> : <FaPen />}
                  </button>
                </div>

                <input
                  type="email"
                  value="nguyenvana@gmail.com"
                  readOnly
                  className="w-full border-b border-gray-400 bg-transparent"
                />

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
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </section>

            {/* === Divider === */}
            <div className="hidden md:block w-px bg-gray-300 self-stretch"></div>

            {/* === Cài đặt giao diện === */}
            <section className="flex-1 mt-10 md:mt-0">
              <h3 className="text-lg font-semibold mb-4">Giao diện</h3>
<label className="block mb-2 font-medium">Chủ đề</label>
              <div className="flex space-x-6 mb-6">
                {["light", "dark", "system"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={opt}
                      checked={theme === opt}
                      onChange={() => setTheme(opt)}
                    />
                    <span>
                      {opt === "light"
                        ? "Sáng"
                        : opt === "dark"
                        ? "Tối"
                        : "Hệ thống"}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <label className="flex items-center space-x-2 mb-2 font-medium cursor-pointer">
                  <span>Ngôn ngữ</span>
                  <FaGlobe />
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
