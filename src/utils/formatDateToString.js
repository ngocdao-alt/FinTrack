function formatDateToString(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');       // Thêm số 0 nếu < 10
  const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() bắt đầu từ 0
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

export default formatDateToString;