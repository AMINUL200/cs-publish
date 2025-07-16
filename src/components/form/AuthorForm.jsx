import React, { useState } from "react";

export default function AuthorForm() {
  const [inputValue, setInputValue] = useState("");
  const [authors, setAuthors] = useState(["Jane Smith", "Michael Johnson"]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      addAuthor();
    }
  };

  const addAuthor = () => {
    const value = inputValue.trim();
    if (value && !authors.includes(value)) {
      setAuthors([...authors, value]);
      setInputValue("");
    }
  };

  const removeAuthor = (indexToRemove) => {
    setAuthors(authors.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-medium mb-3">Authors</h2>
      
      <div className={`flex flex-wrap items-center gap-2 border rounded p-2 ${
        isInputFocused ? 'ring-1 ring-blue-400 border-blue-400' : 'border-gray-300'
      }`}>
        {authors.map((author, index) => (
          <div key={index} className="flex items-center bg-gray-200 px-2 py-1 rounded-2xl">
            <span className="mr-1">{author}</span>
            <button
              onClick={() => removeAuthor(index)}
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
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => {
              setIsInputFocused(false);
              if (inputValue.trim()) addAuthor();
            }}
            // placeholder={authors.length === 0 ? "Add authors..." : ""}
            placeholder="Add authors..."
            className="flex-1 min-w-[100px] p-1 outline-none"
          />
          {inputValue.trim() && (
            <button
              onClick={addAuthor}
              className="ml-2 bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-1">
        Type and press Enter, Tab or comma to add
      </p>
      
      <button
        onClick={() => console.log(authors)}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Authors
      </button>
      
      <div className="mt-4 text-sm bg-gray-50 p-2 rounded">
        <pre>{JSON.stringify({ authors }, null, 2)}</pre>
      </div>
    </div>
  );
}