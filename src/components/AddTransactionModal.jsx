import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch } from "react-redux";
import { createTransaction } from "../features/transactionSlice";

const categoryList = [
  "Bán hàng",
  "Di chuyển",
  "Giáo dục",
  "Giải trí",
  "Lương",
  "Mua sắm",
  "Sức khỏe",
  "Thuê nhà",
  "Thưởng",
  "Ăn uống",
  "Đầu tư"
];

const AddTransactionModal = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    type: "income",
    amount: "",
    category: "",
    note: "",
    date: "",
    isRecurring: false,
    receiptImages: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") setForm({ ...form, [name]: checked });
    else if (type === "file") setForm({ ...form, receiptImages: Array.from(files) });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTransaction(form)).unwrap();
      onSuccess();           // ⬅️ reload list
      onClose();             // đóng modal
    } catch (err) {
      alert("Lỗi thêm giao dịch: " + err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-md w-full max-w-md relative shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
          <IoMdCloseCircle size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">Thêm giao dịch</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loại */}
          <div>
            <label className="block mb-1">Loại giao dịch</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="income">Thu</option>
              <option value="expense">Chi</option>
            </select>
          </div>

          {/* Số tiền */}
          <div>
            <label className="block mb-1">Số tiền</label>
            <input type="number" name="amount" value={form.amount}
              onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          </div>

          {/* Mục */}
          <div>
            <label className="block mb-1">Mục</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" required>
              <option value="">-- Chọn mục --</option>
              {categoryList.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block mb-1">Ghi chú</label>
            <input type="text" name="note" value={form.note}
              onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          {/* Ngày */}
          <div>
            <label className="block mb-1">Ngày</label>
            <input type="date" name="date" value={form.date}
              onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          </div>

          {/* Định kỳ */}
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isRecurring" checked={form.isRecurring} onChange={handleChange} />
            <label>Giao dịch định kỳ</label>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
