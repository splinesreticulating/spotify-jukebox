import React from "react";

interface RadioButtonGroupProps {
  name: string;
  options: { id: string; value: string; label: string; checked: boolean }[];
}

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  name,
  options,
}) => (
  <fieldset>
    <legend className="mb-2 block text-sm font-medium">Level</legend>
    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
      <div className="flex gap-4">
        {options.map((option) => (
          <div className="flex items-center" key={option.id}>
            <input
              id={option.id}
              name={name}
              type="radio"
              value={option.value}
              defaultChecked={option.checked}
              className="mr-2"
            />
            <label
              htmlFor={option.id}
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  </fieldset>
);
