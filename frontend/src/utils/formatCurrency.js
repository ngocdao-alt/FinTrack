const formatCurrency = (num) =>
  Number(num).toLocaleString("vi-VN", {
    style: "decimal",
    minimumFractionDigits: 0,
  });

export default formatCurrency;
