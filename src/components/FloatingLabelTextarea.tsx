import {
  ChangeEvent,
  useState,
  forwardRef,
  useEffect,
} from 'react';

import '../styles/CustomInput.scss';
import '../styles/Dashboard/Card.scss';

interface Props {
  name: string;
  label: string;
  required: boolean;
  isResizable?: boolean;
  defaultValue?: string;
  maxLength?: number;
}

const FloatingLabelTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    { name, label, required, isResizable, defaultValue, maxLength }: Props,
    ref
  ) => {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (defaultValue) {
        setValue(defaultValue);
      }
    }, [defaultValue]);

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value);
    };

    const handleInputFocus = () => {
      setIsFocused(true);
    };

    const handleInputBlur = () => {
      setIsFocused(false);
    };

    return (
      <>
        <div className={`form-floating-custom ${isFocused ? 'focused' : ''}`}>
          <textarea
            required={required}
            className={`form-control textarea-filter ${
              !isResizable ? 'textarea-limited' : ''
            }`}
            id='floatingTextarea'
            name={name}
            placeholder=' '
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            ref={ref}
            maxLength={maxLength ? maxLength : undefined}
            aria-describedby='help'
          />
          <label className='form-textarea-label' htmlFor='floatingTextarea'>
            {label}
          </label>
        </div>
      </>
    );
  }
);

export default FloatingLabelTextarea;
