import { ChangeEvent, useState, RefObject, forwardRef } from 'react';

import '../styles/customForm.scss';

interface Props {
  label: string;
  type: string;
  name: string;
  required: boolean;
}

const FloatingLabelInput = forwardRef<HTMLInputElement, Props>(
  ({ label, type, name, required }: Props, ref) => {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    };

    const handleInputFocus = () => {
      setIsFocused(true);
    };

    const handleInputBlur = () => {
      setIsFocused(false);
    };

    return (
      <div className={`form-floating-custom ${isFocused ? 'focused' : ''}`}>
        <input
          type={type}
          name={name}
          required={required}
          className='form-control'
          id='floatingInput'
          placeholder=' '
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          ref={ref}
        />
        <label htmlFor='floatingInput'>{label}</label>
      </div>
    );
  }
);

export default FloatingLabelInput;
