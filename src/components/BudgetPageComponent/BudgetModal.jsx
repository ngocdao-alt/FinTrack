import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBudget } from "../../features/budgetSlice";
import toast from "react-hot-toast";
import axios from "axios";

const BudgetModal = ({ monthValues, years, setIsFormOpen, token, onClose }) => {
  const error = useSelector((state) => state.budget.error);
  const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;
  const now = new Date();
  const dispatch = useDispatch();

  const categoryOptions = [
    "Nhà cửa",
    "Ăn uống",
    "Di chuyển",
    "Giáo dục",
    "Đầu tư",
    "Giải trí",
    "Mua sắm",
  ];

  const [formData, setFormData] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    totalAmount: "",
    categories: [],
  });

  const closeForm = (e) => {
    e.stopPropagation();
    setIsFormOpen(false);
  };

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await axios.get(
          `${BACK_END_URL}/api/budget?month=${formData.month}&year=${formData.year}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Nếu có budget => set form
        if (res) {
          const data = res.data;

          setFormData({
            month: data.month,
            year: data.year,
            totalAmount: data.totalBudget || 0,
            categories: data.categoryStats.map((c) => ({
              name: c.category,
              amount: c.budgetedAmount,
            })),
          });
        }
      } catch (error) {
        console.error("❌ Không lấy được budget:", error);
      }
    };

    fetchBudget();
  }, [dispatch, formData.month, formData.year]); // chạy một lần khi mở modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalAmount" ? parseInt(value) : value,
    }));
  };

  const addCategory = () => {
    const selected = formData.categories.map((c) => c.name);
    const available = categoryOptions.filter((opt) => !selected.includes(opt));

    if (available.length === 0) {
      console.warn("Không còn hạng mục để thêm!");
      return;
    }

    // Mặc định chọn hạng mục đầu tiên còn lại
    const newCategory = {
      name: available[0],
      amount: "",
    };

    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const updateCategory = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.categories];

      updated[index] = {
        ...updated[index],
        [field]: field === "amount" ? Number(value) : value,
      };

      return {
        ...prev,
        categories: updated,
      };
    });
  };

  const removeCategory = (index) => {
    const updated = formData.categories.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      categories: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transformedCategories = formData.categories.map((cat) => ({
      category: cat.name,
      amount: cat.amount,
    }));

    try {
      await dispatch(
        addBudget({
          month: Number(formData.month),
          year: Number(formData.year),
          totalAmount: Number(formData.totalAmount),
          categories: transformedCategories,
        })
      );
      if (!error) {
        toast.success("Added Budget");
        setIsFormOpen(false);
        onClose?.();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something is wrong!");
    }
  };

  const selectedCategories = formData.categories.map((c) => c.name);
  const remainingOptions = categoryOptions.filter(
    (opt) => !selectedCategories.includes(opt)
  );

  return (
    <section
      onClick={closeForm}
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px] bg-black/30"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg relative z-50 animate-fadeIn"
      >
        <h2 className="text-xl text-black font-semibold mb-4">Add Budget</h2>

        <div className="flex flex-col gap-4">
          {/* Month */}
          <div>
            <label className="block font-medium text-gray-700">Month:</label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 bg-white rounded cursor-pointer outline-none"
            >
              {monthValues?.map((item, index) => (
                <option
                  className="cursor-pointer"
                  key={index}
                  value={item.value}
                >
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block font-medium text-gray-700">Year:</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 bg-white rounded cursor-pointer outline-none"
            >
              {years?.map((item, index) => (
                <option className="cursor-pointer" key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Total Amount */}
          <div>
            <label className="block font-medium text-gray-700">
              Total Budget:
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              placeholder="VD: 10000000"
              className="w-full p-2 border border-slate-300 rounded outline-slate-300"
              required
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block font-medium text-gray-700">
              Categories:
            </label>
            {formData.categories.map((cat, index) => {
              // Lấy ra danh sách các category đã chọn ở các dòng khác
              const selectedCategories = formData.categories
                .filter((_, i) => i !== index)
                .map((c) => c.name);

              // Lọc ra các option chưa được chọn hoặc chính nó (để không mất giá trị hiện tại)
              const availableOptions = categoryOptions.filter(
                (opt) => !selectedCategories.includes(opt) || opt === cat.name
              );

              return (
                <div key={index} className="flex gap-2 mt-2 ">
                  <select
                    name="category"
                    value={cat.name}
                    onChange={(e) =>
                      updateCategory(index, "name", e.target.value)
                    }
                    className="w-full p-2 border border-slate-300 bg-white rounded cursor-pointer outline-none"
                  >
                    {availableOptions.map((item, idx) => (
                      <option className="cursor-pointer" key={idx} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <input
                    name="amount"
                    type="number"
                    value={cat.amount}
                    onChange={(e) =>
                      updateCategory(index, "amount", e.target.value)
                    }
                    placeholder="Số tiền"
                    className="w-[120px] p-2 border border-slate-300 rounded"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => removeCategory(index)}
                    className="text-red-500 font-bold cursor-pointer hover:scale-110 transition-all"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => {
                if (remainingOptions.length === 0) return;
                addCategory();
              }}
              className={`mt-2 font-semibold transition-all ${
                remainingOptions.length === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-500 hover:underline cursor-pointer"
              }`}
              disabled={remainingOptions.length === 0}
            >
              + Thêm hạng mục
            </button>
          </div>

          <button
            type="submit"
            className="bg-[#8574d4] text-white rounded p-2 mt-4 hover:bg-[#6A57DE] cursor-pointer transition-all"
          >
            Lưu ngân sách
          </button>
        </div>
      </form>
    </section>
  );
};

export default BudgetModal;
