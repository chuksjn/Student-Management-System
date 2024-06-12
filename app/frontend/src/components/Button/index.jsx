/* eslint-disable react/prop-types */
import { Loader } from '../Loader';
import './styles.css';

export const Button = ({
  primary = false,
  mono = false,
  danger = false,

  disabled = false,
  label = 'Button',
  type = 'button',
  effect,
  loading = false,
  ...props
}) => {
  const mode = primary
    ? ' bg-[#35B9E9] text-white duration-200 transition disabled:bg-[#F1F1F4] disabled:text-[#CDD0D5]'
    : danger
    ? 'bg-white text-[#DF1C41] border border-[#DF1C41] hover:bg-[#DF1C41] hover:text-white hover:shadow-none duration-200 transition  '
    : mono
    ? 'bg-white border border-[#E2E4E9] text-[#525866] duration-200 transition   '
    : ' bg-[#35B9E9] text-white duration-200 transition disabled:bg-[#F1F1F4]/60 disabled:text-[#CDD0D5]';

  return (
    <button
      type={type}
      className={['btn', `${mode}`, ` rounded-xl`].join(' ')}
      disabled={disabled || loading}
      onClick={effect}
      {...props}
    >
      {loading ? (
        <span className='w-full grid place-items-center relative'>
          <span className='absolute z-10'>
            <Loader bgColor='#2C1DFF' />
          </span>
          <span className='opacity-0'>{label}</span>
        </span>
      ) : (
        <>
          <span className='px-1'>{label}</span>
        </>
      )}
    </button>
  );
};
