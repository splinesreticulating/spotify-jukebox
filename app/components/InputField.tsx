import { mobileInputConfig } from "@/app/lib/constants/input-configs"
import type { InputFieldProps } from "@/app/lib/types"

export function InputField({
    label,
    error,
    className = "",
    ...props
}: InputFieldProps) {
    return (
        <div>
            <label
                htmlFor={props.id || props.name}
                className="mb-2 block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <input
                {...mobileInputConfig}
                {...props}
                className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 ${className}`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}
