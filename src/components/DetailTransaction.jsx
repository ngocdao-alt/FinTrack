import React from "react";

const DetailTransaction = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg relative z-50 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">Chi tiết giao dịch</h2>

        <div className="space-y-4 text-sm md:text-base">
          <Info label="Loại" value={transaction.type === "income" ? "Thu" : "Chi"} />
          <Info label="Số tiền" value={transaction.amount.toLocaleString("vi-VN") + " đ"} />
          <Info label="Danh mục" value={transaction.category} />
          <Info label="Ghi chú" value={transaction.note || "-"} />
          <Info
            label="Ngày"
            value={
              transaction.isRecurring
                ? `Giao dịch định kỳ ngày ${transaction.recurringDay} hàng tháng`
                : new Date(transaction.date).toLocaleDateString("vi-VN")
            }
          />

          {/* ✅ Hiển thị ảnh hóa đơn nếu có */}
          {transaction.receiptImage?.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Ảnh hóa đơn</label>
              <div className="grid grid-cols-2 gap-2 ">
                {transaction.receiptImage.map((url, i) => (
                  <img
                    onClick={() => window.open(url)}
                    key={i}
                    src={url}
                    alt={`Hóa đơn ${i + 1}`}
                    className="max-h-30 aspect-auto rounded border shadow hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <span className="font-medium text-gray-600">{label}:</span>{" "}
    <span className="text-gray-800">{value}</span>
  </div>
);

export default DetailTransaction;
