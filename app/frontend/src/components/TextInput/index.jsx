/* eslint-disable react/prop-types */
import styles from './styles.module.css';

export const TextInput = ({
  label,
  placeholder,
  type = 'text',
  required = false,
  name,
  autoFocus = false,
  value = '',
  readOnly,
  hint,
  handleInputChange,
  ...props
}) => {
  const handleChange = (e) => {
    if (type === 'number' && !/^\d*\.?\d*$/.test(e.target?.value)) {
      // Ignore non-numeric or non-decimal input when type is "number ""
      return;
    }
    if (type === 'tel' && isNaN(Number(e.target.value))) {
      // Ignore non-numeric input when type is "number"
      return;
    }
    handleInputChange(e);
  };
  return (
    <div className={styles.input_container}>
      {label && (
        <label className={styles.input_label} htmlFor={name}>
          {label}
          {required && <span className={styles.input_required}></span>}
        </label>
      )}
      <input
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        autoFocus={autoFocus}
        required={required}
        type={type}
        id={name}
        name={name}
        className={styles.input_field}
        readOnly={readOnly}
        {...props}
      />
      {hint && (
        <span className='text-xs flex items-center gap-x-2 mt-1 text-[#525866]'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4 9.8V11H8.6V9.8H7.4ZM7.4 5V8.6H8.6V5H7.4Z'
              fill='#868C98'
            />
          </svg>
          {hint}
        </span>
      )}
    </div>
  );
};
