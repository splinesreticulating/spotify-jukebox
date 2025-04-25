interface NumericalDropDownProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    lowerValue: number
    upperValue: number
    nullOptionLabel?: string
}

export function NumericalDropDown({
    label,
    lowerValue,
    upperValue,
    nullOptionLabel = "Select a value",
    className = "",
    ...props
}: NumericalDropDownProps) {
    const options = []
    for (let i = lowerValue; i <= upperValue; i++) {
        options.push(i)
    }

    return (
        <div>
            <label
                htmlFor={props.id || props.name}
                className="mb-2 block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <select
                {...props}
                className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 ${className}`}
            >
                <option value="">{nullOptionLabel}</option>
                {options.map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    )
}
