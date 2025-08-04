import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "../features/authSlice";
import toast from "react-hot-toast";

// ...imports giữ nguyên

const SettingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState({
    name: user.name,
    phone: user.phone,
    dob: user.dob,
    address: user.address,
  });
  const [editing, setEditing] = useState({
    name: false,
    phone: false,
    dob: false,
    address: false,
  });

  useEffect(() => {
    console.log(user);
  }, []);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("vi");
  const [isHovering, setIsHovering] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const toggleEdit = (field) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveProfile = () => {
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("phone", profile.phone);
    formData.append("dob", profile.dob);
    formData.append("address", profile.address);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      dispatch(updateUser(formData));
      toast.success("Đã lưu thông tin!");
    } catch (err) {
      toast.error("Lỗi khi lưu: " + err.message || err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast("Đã đăng xuất!", { icon: "👋" });
  };

  const EditableField = ({ label, field }) => (
    <div className="relative">
      <input
        type="text"
        value={profile[field]}
        readOnly={!editing[field]}
        onChange={(e) =>
          setProfile((prev) => ({ ...prev, [field]: e.target.value }))
        }
        className={`w-full border-b bg-transparent pr-8 px-2 py-1 ${
          editing[field]
            ? "border-indigo-400 focus:outline-[#7E5BEF]"
            : "border-gray-400 outline-none cursor-not-allowed"
        }`}
      />
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600"
        onClick={() => toggleEdit(field)}
        title={editing[field] ? `Lưu ${label}` : `Chỉnh sửa ${label}`}
      >
        {editing[field] ? <FaSave /> : <FaPen />}
      </button>
    </div>
  );

  return (
    <div className="h-fit flex items-start justify-center bg-[#f3f4f6] sm:h-full xl:items-center">
      <main className="flex-1 px-4 sm:px-6 py-6">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Cài đặt</h2>

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
            {/* === Thông tin người dùng === */}
            <section className="flex-1 w-full sm:px-3">
              <h3 className="w-full text-center text-lg font-semibold mb-4 sm:text-left">
                Thông tin người dùng
              </h3>

              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="relative h-20 w-20 rounded-full overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  title="Đổi ảnh"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#7e5bef] flex items-center justify-center">
                      <FaUser className="text-white text-3xl" />
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 bg-gray-800/70 flex items-center justify-center rounded-full z-10 transition-opacity duration-300 ${
                      isHovering ? "opacity-100" : "opacity-0"
                    }`}
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

              {/* Các trường chỉnh sửa */}
              <div className="space-y-4">
                <EditableField label="Tên" field="name" />
                <EditableField label="SĐT" field="phone" />
                <EditableField label="Ngày sinh" field="dob" />
                <EditableField label="Địa chỉ" field="address" />

                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full px-2 py-1 border-b border-gray-400 bg-transparent outline-none cursor-not-allowed"
                />

                <div className="relative select-none">
                  <input
                    type={showPassword ? "text" : "password"}
                    value="123456"
                    readOnly
                    className="w-full px-2 py-1 border-b border-gray-400 bg-transparent pr-8 outline-none cursor-not-allowed"
                  />
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-600 hover:text-indigo-600"
                    onClick={() => setShowPassword((s) => !s)}
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="block text-center w-full bg-indigo-500 text-white py-1 rounded-md hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  Lưu
                </button>
              </div>
            </section>

            {/* Cài đặt giao diện */}
            <div className="hidden md:block w-px bg-gray-300 self-stretch" />
            <section className="w-full my-3 flex-1 md:mt-0">
              <h3 className="text-lg font-semibold mb-4 text-left">
                Giao diện
              </h3>

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

              <button
                onClick={handleLogout}
                className="block text-center w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition-colors cursor-pointer"
              >
                Đăng xuất
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingPage;
