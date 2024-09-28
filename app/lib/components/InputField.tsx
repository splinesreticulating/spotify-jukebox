import React from "react";

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type: string;
  defaultValue?: string | number;
  step?: string;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  type,
  defaultValue,
  step,
  placeholder,
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="mb-2 block text-sm font-medium">
      {label}
    </label>
    <div className="relative mt-2 rounded-md">
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        step={step}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md p-2"
      />
    </div>
  </div>
);
