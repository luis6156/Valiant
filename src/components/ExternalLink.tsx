import React from 'react';

const ipcRenderer = window.ipcRenderer;

interface Props {
  href: string;
  children: React.ReactNode;
  underline: boolean;
}

const ExternalLink = ({ href, children, underline }: Props) => {
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    ipcRenderer.send('open-external-link', { href });
  };

  return (
    <a
      href={href}
      className={`${!underline ? 'link-no-underline' : ''}`}
      onClick={handleLinkClick}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
