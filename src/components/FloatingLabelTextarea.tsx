import {
  ChangeEvent,
  useState,
  forwardRef,
  TextareaHTMLAttributes,
} from 'react';

import '../styles/customInput.scss';
import '../styles/card.scss';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required: boolean;
}

const FloatingLabelTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, required, ...rest }: Props, ref) => {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

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
            {...rest}
            required={required}
            className='form-control textarea-filter'
            id='floatingTextarea'
            placeholder=' '
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            ref={ref}
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
