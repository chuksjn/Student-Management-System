/* eslint-disable react/prop-types */
import styles from './styles.module.css';

export const TextArea = ({
  label,
  placeholder,
  rows = 5,
  required = false,
  name,
  autoFocus = false,
  value,
  readOnly,
  hint,
  handleInputChange,
  className,
  ...props
}) => {
  return (
    <div className={styles.input_container}>
      {label && (
        <label className={styles.input_label} htmlFor={name}>
          {label}
          {required && <span className='input--required'></span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        onChange={handleInputChange}
        value={value}
        autoFocus={autoFocus}
        required={required}
        id={name}
        rows={rows}
        name={name}
        className={`${styles.input_field} ${className}`}
        readOnly={readOnly}
        {...props}
      />
      <span>{hint}</span>
    </div>
  );
};
