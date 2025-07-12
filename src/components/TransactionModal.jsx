import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, updateTransaction } from "../features/transactionSlice";
import toast from "react-hot-toast";
import getUsedCategories from "../thunks/getUsedCategories";

const now = new Date();
const initialState = {
  type: "income",
  amount: "",
  category: "",
  note: "",
  date: now.toISOString().slice(0, 10),
  receiptImages: [],
  isRecurring: false,
  recurringDay: now.getDate(),
};

const TransactionModal = ({ visible, onClose, transaction }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialState);

  const [categoryList, setCategoryList] = useState([
    [
      "Bán hàng",
      "Di chuyển",
      "Giáo dục",
      "Giải trí",
      "Lương",
      "Mua sắm",
      "Sức khỏe",
    ],
  ]);

  useEffect(() => {
    const getCategories = async () => {
      const res = await dispatch(getUsedCategories());
      setCategoryList(res.payload);
    };
    getCategories();
  }, [dispatch]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        date: transaction.date ? transaction.date.slice(0, 10) : "",
        receiptImages: [],
      });
    } else {
      setFormData(initialState);
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const selectedFiles = Array.from(files);
      const currentFiles = formData.receiptImages || [];

      const totalFiles = [...currentFiles, ...selectedFiles];
      const uniqueFiles = totalFiles.reduce((acc, file) => {
        if (!acc.find((f) => f.name === file.name)) acc.push(file);
        return acc;
      }, []);

      if (uniqueFiles.length > 5) {
        toast.error("You can upload up to 5 images only!");
        return;
      }

      setFormData((prev) => ({ ...prev, receiptImages: uniqueFiles }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.isRecurring) delete dataToSubmit.recurringDay;

      if (transaction) {
        await dispatch(updateTransaction({ id: transaction._id, fields: dataToSubmit })).unwrap();
        toast.success("Updated successfully!");
      } else {
        await dispatch(createTransaction(dataToSubmit)).unwrap();
        toast.success("Transaction created successfully!");
      }

      onClose();
    } catch (err) {
      toast.error(err || "An error occurred!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px] bg-black/30">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg relative z-50 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">
          {transaction ? "Edit Transaction" : "Add Transaction"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Select category --</option>
              {Array.isArray(categoryList) &&
                categoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows="2"
            ></textarea>
          </div>

          {!formData.isRecurring && (
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
            />
            <label className="text-sm">Recurring transaction</label>
          </div>

          {formData.isRecurring && (
            <div>
              <label className="block text-sm font-medium">Recurring day (1-31)</label>
              <input
                type="number"
                name="recurringDay"
                min={1}
                max={31}
                value={formData.recurringDay}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Receipt images (optional)</label>
            <div className="relative w-full p-4 border-2 border-dashed rounded-lg text-center hover:bg-gray-50 cursor-pointer transition">
              <label htmlFor="file-upload" className="cursor-pointer block text-gray-600 hover:text-indigo-600">
                📎 Click to upload receipts
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleChange}
                className="hidden"
              />
            </div>

            {formData.receiptImages.length > 0 && (
              <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                {formData.receiptImages.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 cursor-pointer"
            >
              {transaction ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
