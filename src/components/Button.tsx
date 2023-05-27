import React from 'react';

interface Props {
  bgColor: string;
  color: string;
  size?: string;
  text: string;
  borderRadius: string;
}

const Button = ({ bgColor, color, size, text, borderRadius }: Props) => {
  return (
    <button
      type='button'
      className={`text-${size} p-3 hover:drop-shadow-xl`}
      style={{ backgroundColor: bgColor, color, borderRadius }}
    >
      {text}
    </button>
  );
};

export default Button;
