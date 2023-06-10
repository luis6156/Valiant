import { Icon } from '@iconify/react';

interface Props {
  text: string;
}

const AttentionText = ({ text }: Props) => {
  return (
    <div className='d-flex align-items-center'>
      <Icon className='form-text-icon' icon='mingcute:warning-line' />
      <div id='help' className='form-text m-0 ms-1'>
        {text}
      </div>
    </div>
  );
};

export default AttentionText;
