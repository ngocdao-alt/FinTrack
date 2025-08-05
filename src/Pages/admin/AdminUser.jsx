import React, { useState } from "react";
import { FaTrash, FaSearch } from "react-icons/fa";

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-[0.75px]"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg max-w-md w-full animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <div className="text-right mt-4">
        </div>
      </div>
    </div>
  );
};

const AdminUser = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const users = [
    { name: "Mã Gia Bảo", email: "magiabao22@gmail.com", role: "Admin", status: "Active", date: "03/08/2024" },
    { name: "Lê Tấn Đạt", email: "DatLt@gmail.com", role: "Admin", status: "Active", date: "03/08/2024" },
    { name: "Hồng Hiếu Thiên", email: "HieuThien@gmail.com", role: "Admin", status: "Active", date: "03/08/2024" },
    { name: "Nguyễn Ngọc Đạo", email: "NNDao@gmail.com", role: "Admin", status: "Active", date: "03/08/2024" },
    { name: "Ngô Quang Vũ", email: "quangvu@gmail.com", role: "User", status: "Banned", date: "03/08/2024" },
    { name: "Đặng Quốc Thanh", email: "thanh@gmail.com", role: "User", status: "Banned", date: "03/08/2024" }
  ];

  return (
    <div className="min-h-screen bg-[#EDF6FC] flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded shadow">
        <main className="w-full px-4 pb-30 pt-10 rounded-lg shadow border border-gray-500">
          {/* Filter Section */}
          <div className="flex flex-wrap gap-10 mb-10">
            <div className="flex items-center border border-blue-400 rounded px-4 py-1 bg-gray-50 w-full max-w-3xl">
              <input
                type="text"
                placeholder="Tìm theo tên hoặc email..."
                className="flex-grow py-1 outline-none bg-transparent"
              />
              <FaSearch className="text-gray-600 ml-2" />
            </div>

            <select className="border border-blue-400 rounded px-4 bg-gray-50">
              <option>Role</option>
              <option>Admin</option>
              <option>User</option>
            </select>
            <select className="border border-blue-400 rounded px-4 py-1 bg-gray-50">
              <option>Trạng thái</option>
              <option>Active</option>
              <option>Banned</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm border border-blue-500 rounded">
              <thead className="bg-white text-gray-800">
                <tr className="border-b border-blue-500">
                  <th className="p-3 text-left">Tên người dùng</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Vai trò</th>
                  <th className="p-3 text-left">Trạng thái</th>
                  <th className="p-3 text-left">Ngày tạo</th>
                  <th className="p-3 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx} className="border-b border-blue-500 hover:bg-gray-50">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3 underline text-gray-800">{user.email}</td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: user.role === "Admin" ? "#96C1F8" : "#E0E0E0",
                          color: "#333",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: user.status === "Active" ? "#D1F2D1" : "#FECACA",
                          color: user.status === "Active" ? "#2E7D32" : "#C62828",
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3">{user.date}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        className="px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-300"
                        onClick={() => setShowEditModal(true)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 border border-blue-500 text-gray-800 rounded hover:bg-red-500"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
<Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
  <h2 className="text-lg font-semibold mb-4">Chỉnh sửa người dùng</h2>
  <input
    type="text"
    placeholder="User name"
    className="w-full border rounded px-3 py-2 mb-2"
  />
  <input
    type="email"
    placeholder="Email"
    className="w-full border rounded px-3 py-2 mb-2"
  />
  <select className="w-full border rounded px-3 py-2 mb-2">
    <option>Role</option>
    <option>Admin</option>
    <option>User</option>
  </select>
  <select className="w-full border rounded px-3 py-2">
    <option>Trạng thái</option>
    <option>Active</option>
    <option>Banned</option>
  </select>
  <div className="mt-6 flex justify-between">
    <button
      onClick={() => setShowEditModal(false)}
      className="px-4 py-2 bg-gray-300 rounded"
    >
      Cancel
    </button>
    <button className="px-4 py-2 bg-blue-400 text-white rounded">Save</button>
  </div>
</Modal>

<Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
  <h2 className="text-lg font-semibold mb-4">Xóa người dùng</h2>
  <p>Bạn có chắc muốn xóa người dùng này không?</p>
  <div className="mt-6 flex justify-between">
    <button
      onClick={() => setShowDeleteModal(false)}
      className="px-4 py-2 bg-gray-300 rounded"
    >
      Cancel
    </button>
    <button className="px-4 py-2 bg-red-500 text-white rounded">
      Delete
    </button>
  </div>
</Modal>

    </div>
  );
};

export default AdminUser;
