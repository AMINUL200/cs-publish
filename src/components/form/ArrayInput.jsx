import React, { useState } from "react";

export default function ArrayInput({
  label,
  values,
  onChange, // a callback to update parent
  placeholder = "Add item…"
}) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      addItem();
    }
  };

  const removeItem = (index) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      {label && <label className="block mb-1 font-medium">{label}</label>}

      <div
        className={`flex flex-wrap items-center gap-2 border rounded p-2 ${
          isFocused ? "ring-1 ring-blue-400 border-blue-400" : "border-gray-300"
        }`}
      >
        {values.map((item, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-200 px-2 py-1 rounded-2xl"
          >
            <span className="mr-1">{item}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-gray-500 hover:text-red-500 text-sm"
            >
              &times;
            </button>
          </div>
        ))}

        <div className="flex-1 flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              if (inputValue.trim()) addItem();
            }}
            // placeholder={values.length === 0 ? placeholder : ""}
            placeholder={placeholder}
            className="flex-1 min-w-[100px] p-1 outline-none"
          />
          {inputValue.trim() && (
            <button
              type="button"
              onClick={addItem}
              className="ml-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500">Type & press Enter, Tab, or comma</p>
    </div>
  );
}
