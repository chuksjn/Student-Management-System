/* eslint-disable react/prop-types */

export const CheckboxElement = ({
  label,
  name,
  checked,
  disabled,
  changeFunction,
}) => {
  return (
    <div className='flex items-center gap-x-[10px]'>
      <input
        type='checkbox'
        id={name}
        className='rounded-[5px] w-5 h-5'
        name={name}
        checked={checked}
        onChange={changeFunction}
        disabled={disabled}
      />
      {label && (
        <label
          htmlFor={name}
          className='text-[#263238] font-semibold -tracking-[3%]'
        >
          {label}
        </label>
      )}
    </div>
  );
};
