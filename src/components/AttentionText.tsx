import { Icon } from '@iconify/react';

interface Props {
  text: string;
  danger?: string;
}

const AttentionText = ({ text, danger }: Props) => {
  return (
    <div className='d-flex align-items-center'>
      <Icon
        className={`form-text-icon ${danger ? 'form-text-icon-danger' : ''}`}
        icon='mingcute:warning-line'
      />
      <div id='help' className={`form-text m-0 ms-1 ${danger ? 'form-text-icon-danger' : ''}`}>
        {danger ? danger : text}
      </div>
    </div>
  );
};

export default AttentionText;
