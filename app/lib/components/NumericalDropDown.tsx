type NumericalDropDownProps = {
  name: string
  lowerValue: number
  upperValue: number
  defaultValue: number | null
  nullOptionLabel?: string
  className?: string
}

export const NumericalDropDown: React.FC<NumericalDropDownProps> = ({
  name,
  lowerValue,
  upperValue,
  defaultValue,
  nullOptionLabel = 'Select a value',
  className = '',
}) => {
  const options = []

  for (let i = lowerValue; i <= upperValue; i++) {
    options.push(i)
  }

  return (
    <select name={name} defaultValue={defaultValue ?? ''} className={className}>
      <option value="">{nullOptionLabel}</option>
      {options.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  )
}
