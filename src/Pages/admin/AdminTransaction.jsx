import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminTransaction = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [startDate, setStartDate] = useState(new Date(2024, 0, 1)); // 01/01/2024
  const [endDate, setEndDate] = useState(new Date(2024, 7, 3)); // 03/08/2024
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectingStartDate, setSelectingStartDate] = useState(true);
  
  const datePickerRef = useRef(null);

  const transactions = [
    {
      id: 1,
      userName: 'Mã Gia Bảo',
      category: 'Ăn uống',
      amount: 500000,
      type: 'income',
      note: 'gbchvajcbsajdk',
      date: '03/08/2024',
    },
    {
      id: 2,
      userName: 'Lê Tấn Đạt',
      category: 'Bán hàng',
      amount: 500000,
      type: 'income',
      note: '',
      date: '03/08/2024',
    },
    {
      id: 3,
      userName: 'Hồng Hiếu Thiên',
      category: 'Di chuyển',
      amount: 500000,
      type: 'expense',
      note: '',
      date: '03/08/2024',
    },
    {
      id: 4,
      userName: 'Nguyễn Ngọc Đạo',
      category: 'Mua sắm',
      amount: 500000,
      type: 'expense',
      note: '',
      date: '03/08/2024',
    },
    {
      id: 5,
      userName: 'Ngô Quang Vũ',
      category: 'Nhà cửa',
      amount: 500000,
      type: 'expense',
      note: '',
      date: '03/08/2024',
    },
    {
      id: 6,
      userName: 'Đặng Quốc Thành',
      category: 'Giáo dục',
      amount: 500000,
      type: 'expense',
      note: '',
      date: '03/08/2024',
    }
  ];

  const categories = ['All', 'Ăn uống', 'Bán hàng', 'Di chuyển', 'Mua sắm', 'Nhà cửa', 'Giáo dục'];

  const formatAmount = (amount, type) => {
    const formatted = amount.toLocaleString();
    return type === 'income' ? `+${formatted} đ` : `-${formatted} đ`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDateRange = () => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    
    if (selectingStartDate) {
      setStartDate(selectedDate);
      setSelectingStartDate(false);
    } else {
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
        setShowDatePicker(false);
        setSelectingStartDate(true);
      } else {
        // If selected end date is before start date, swap them
        setEndDate(startDate);
        setStartDate(selectedDate);
        setShowDatePicker(false);
        setSelectingStartDate(true);
      }
    }
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const isDateInRange = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.getTime() === startDate.getTime() || date.getTime() === endDate.getTime();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isDateSelected(day);
      const isInRange = isDateInRange(day);
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`w-8 h-8 text-sm rounded-full flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-blue-500 text-white font-semibold'
              : isInRange
              ? 'bg-blue-100 text-blue-700'
              : isToday
              ? 'bg-gray-200 text-gray-900 font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
        setSelectingStartDate(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#EDF6FC]">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm theo tên"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              />
            </div>

            {/* Date Range */}
            <div className="flex-1 lg:max-w-xs relative" ref={datePickerRef}>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base text-left bg-white"
              >
                {getDateRange()}
              </button>
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              
              {/* Date Picker Dropdown */}
              {showDatePicker && (
                <div className="absolute top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-80">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {selectingStartDate ? 'Chọn ngày bắt đầu' : 'Chọn ngày kết thúc'}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => navigateMonth('prev')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <h3 className="text-lg font-semibold">
                        {monthNames[currentMonth]} {currentYear}
                      </h3>
                      <button
                        onClick={() => navigateMonth('next')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map((day) => (
                        <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {renderCalendar()}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="text-xs text-gray-500">
                      Đã chọn: {getDateRange()}
                    </div>
                    <button
                      onClick={() => {
                        setShowDatePicker(false);
                        setSelectingStartDate(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Xong
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex-1 lg:max-w-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              >
                <option value="">Danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Mobile Cards View */}
          <div className="lg:hidden">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="border-b border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{transaction.userName}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium">
                        {transaction.category}
                      </span>
                    </div>
                    {transaction.note && (
                      <p className="text-sm text-gray-500 mb-2">{transaction.note}</p>
                    )}
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="font-semibold">
                      {formatAmount(transaction.amount, transaction.type)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Note</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.userName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-sm font-medium">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold">
                        {formatAmount(transaction.amount, transaction.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {transaction.note || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{transaction.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium border border-blue-200">
                          Edit
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTransaction;