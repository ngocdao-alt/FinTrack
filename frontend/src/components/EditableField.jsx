import React from "react";

const EditableField = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full border-b bg-transparent px-2 py-1 border-indigo-400 focus:outline-[#7E5BEF] cursor-text"
      />
    </div>
  );
};

export default EditableField;
