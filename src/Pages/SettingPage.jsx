import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCamera,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaPen,
  FaGlobe,
  FaImage,
} from "react-icons/fa";
const SettingPage = () => {
  const [avatar, setAvatar] = useState(null);
  const [userName, setUserName] = useState("Nguyễn Văn A");
  const [editingName, setEditingName] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("vi");
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const saveUserName = () => {
    setEditingName(false);
    // TODO: Gửi tên người dùng mới lên API nếu cần
  };

  return (
    <div className=" flex-1 h-full flex items-center justify-center bg-[#f3f4f6]">
      <main className="flex-1 px-4 sm:px-6 py-6">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Cài đặt</h2>

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
            {/* === Thông tin người dùng === */}
            <section className="flex-1">
              <h3 className="text-lg font-semibold mb-4 text-left w-full">
                Thông tin người dùng
              </h3>

              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="relative h-24 w-24 rounded-full overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  title="Đổi ảnh"
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#7e5bef] flex items-center justify-center">
                      <FaUser className="text-white text-3xl" />
                    </div>
                  )}

                  {/* Overlay luôn có mặt, ẩn hiện bằng opacity */}
                  <div
                    className={`absolute inset-0 bg-gray-800/70 flex items-center justify-center rounded-full z-10
                      transition-opacity duration-300
                      ${isHovering ? "opacity-100" : "opacity-0"}`}
                  >
                    <FaImage className="text-white text-2xl" />
                  </div>

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
              <h3 className="text-lg font-semibold mb-4 text-left">Giao diện</h3>

              <label className="block mb-2 font-medium text-left w-full">
                Chủ đề
              </label>
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
                      className="accent-purple-500"
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
