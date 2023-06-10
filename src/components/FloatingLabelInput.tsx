import { ChangeEvent, useState, RefObject, forwardRef } from 'react';

import AttentionText from './AttentionText';

import '../styles/customInput.scss';
import PillTag from './PillTag';

interface Props {
  label: string;
  type: string;
  name: string;
  required: boolean;
  helpText?: string;
  createPills?: boolean;
}

const FloatingLabelInput = forwardRef<HTMLInputElement, Props>(
  ({ label, type, name, required, helpText, createPills }: Props, ref) => {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [pillValues, setPillValues] = useState<string[]>([]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();

        const trimmedValue = value.trim();
        if (trimmedValue !== '' && pillValues.length < 5) {
          console.log(trimmedValue);
          setPillValues([...pillValues, trimmedValue]);
          setValue('');
        }
      }
    };

    const handleTagClick = (index: number) => {
      const updatedPillValues = [...pillValues];
      updatedPillValues.splice(index, 1);
      setPillValues(updatedPillValues);
    };

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
      <>
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
            onKeyDown={createPills ? handleKeyPress : undefined}
          />
          <label htmlFor='floatingInput'>{label}</label>
        </div>
        {helpText && <AttentionText text={helpText} />}
        {pillValues.length > 0 && (
          <div className='mt-2'>
            <PillTag pillValues={pillValues} handleTagClick={handleTagClick} />
          </div>
        )}
      </>
    );
  }
);

export default FloatingLabelInput;
