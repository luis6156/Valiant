import { ChangeEvent, useState, forwardRef, useEffect, Ref } from 'react';

import AttentionText from './AttentionText';

import '../styles/customInput.scss';
import PillTag from './PillTag';

interface Props {
  label: string;
  type: string;
  name: string;
  required: boolean;
  helpText?: string;
  defaultValue?: string;
  maxLength?: number;
  pillValues?: string[];
  setPillValues?: React.Dispatch<React.SetStateAction<string[]>>;
}

const FloatingLabelInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      type,
      name,
      required,
      helpText,
      defaultValue,
      maxLength,
      pillValues = [],
      setPillValues,
    }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const [value, setValue] = useState(defaultValue || '');
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (defaultValue === undefined) return;

      setValue(defaultValue || '');
    }, [defaultValue]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();

        const trimmedValue = value.trim();
        if (trimmedValue !== '' && pillValues.length < 5) {
          console.log(trimmedValue);
          setPillValues?.([...pillValues, trimmedValue]);
          setValue('');
        }
      }
    };

    const handleTagClick = (index: number) => {
      if (setPillValues) {
        const updatedPillValues = [...pillValues];
        updatedPillValues.splice(index, 1);
        setPillValues(updatedPillValues);
      }
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
            onKeyDown={setPillValues ? handleKeyPress : undefined}
            maxLength={maxLength ? maxLength : undefined}
          />
          <label htmlFor='floatingInput'>{label}</label>
        </div>
        {helpText && isFocused && (
          <div className='help-text mt-2'>
            <AttentionText text={helpText} />
          </div>
        )}
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
