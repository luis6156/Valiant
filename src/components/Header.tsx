import React from 'react';

interface Props {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: Props) => {
  return (
    <>
      <h2>Dashboard</h2>
      <p>Welcome to your feed for OSINT recommendations</p>
    </>
  );
};

export default Header;
