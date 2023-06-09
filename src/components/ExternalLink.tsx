import React from 'react';

const ipcRenderer = window.ipcRenderer;

interface Props {
  href: string;
  children: React.ReactNode;
}

const ExternalLink = ({ href, children }: Props) => {
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    ipcRenderer.send('open-external-link', { href });
  };

  return (
    <a href={href} onClick={handleLinkClick}>
      {children}
    </a>
  );
};

export default ExternalLink;
