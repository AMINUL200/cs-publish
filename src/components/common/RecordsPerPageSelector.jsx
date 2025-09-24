const RecordsPerPageSelector = ({ value, onChange, options }) => {
  return (
    <div className="flex items-center">
      <label htmlFor="recordsPerPage" className="text-sm text-gray-700 mr-2">
        Show
      </label>
      <div className="relative">
        <select
          id="recordsPerPage"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="appearance-none border border-gray-300 rounded-lg py-2 pl-3 pr-8 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer transition-all duration-200 hover:border-gray-400"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <span className="text-sm text-gray-700 ml-2">entries</span>
    </div>
  );
};

export default RecordsPerPageSelector;