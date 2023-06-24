import Header from '@/components/Header';
import React from 'react';

const About = () => {
  return (
    <>
      <div className='mt-3 mb-3'>
        <Header
          title='About'
          subtitle='Build from the ground up by the Data Pilots'
        />
      </div>
      <p>Thank you for choosing us!</p>
    </>
  );
};

export default About;
