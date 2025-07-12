import React, { useEffect, useState } from "react";

const BudgetModal = ({ monthValues, years, setIsFormOpen }) => {
  const now = new Date();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    console.log(monthValues, years);
  }, []);

  const closeForm = (e) => {
    e.stopPropagation();
    setIsFormOpen(false);
  };

  const handleSubmit = () => {};

  return (
    <section
      onClick={closeForm}
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px] bg-black/30"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" bg-white p-6 rounded shadow-lg w-[90%] max-w-lg relative z-50 animate-fadeIn"
      >
        <h2 className="text-xl text-black font-semibold">Add Budget</h2>

        <div className="mt-4 flex flex-col gap-3">
          <div className="w-full flex flex-col items-start gap-1">
            <h3 className="text-[#464646] text-lg font-semibold">Month:</h3>
            <select
              name="months"
              defaultValue={now.getMonth() + 1}
              className="w-full p-2 border border-slate-300 bg-white rounded text-slate-600 outline-none cursor-pointer"
            >
              {monthValues?.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <h3 className="text-[#464646] text-lg font-semibold">Year:</h3>
            <select
              name="years"
              defaultValue={now.getFullYear()}
              className="w-full p-2 border border-slate-300 bg-white rounded text-slate-600 outline-none cursor-pointer"
            >
              {years?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetModal;
