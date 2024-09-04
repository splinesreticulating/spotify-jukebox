import { useState } from 'react';

export function TimeOffDropdown({ initialValue, onChange }) {
  const options = [
    { label: '12 hours', value: 12 },
    { label: '1 day', value: 24 },
    { label: '2 days', value: 48 },
    { label: '3 days', value: 72 },
    { label: '4 days', value: 96 },
    { label: '5 days', value: 120 },
    { label: '1 week', value: 168 },
    { label: '2 weeks', value: 336 },
    { label: '3 weeks', value: 504 },
    { label: '1 month', value: 730 },
    { label: '2 months', value: 1460 },
    { label: '3 months', value: 2190 },
    { label: '4 months', value: 2920 },
    { label: '5 months', value: 3650 },
    { label: '6 months', value: 4368 },
    { label: '1 year', value: 8760 },
    { label: '<abandon this nut>', value: 9999 },
  ];

  const [selectedValue, setSelectedValue] = useState(initialValue || '');

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="hours_off"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Hours off
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <select
          id="hours_off"
          name="hours_off"
          value={selectedValue}
          onChange={handleChange}
          className="form-select block rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        >
          <option value="" disabled>
            Select time off
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
