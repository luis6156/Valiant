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
      <p className='info'>Thank you to all authors who have made the scripts we use open-source:</p>
      <ul>
        <li>MsDorkDump</li>
        <li>Photon</li>
        <li>Webenum</li>
        <li>CrossLinked</li>
        <li>Poastal</li>
        <li>SocialScan</li>
        <li>GitRekt</li>
        <li>GitStalk</li>
        <li>PhishMailer</li>
      </ul>
      <p className='info'>All of the repositories have the author and URL linked in the corresponding script page.</p>
      <p className='info mt-3'>All icons used have been procured from Iconify.</p>
      <p className='info mt-5'><strong>This tool is distributed under the GPL v3 license.</strong></p>
      <p className='info mt-3'><strong>The author is not responsible for any malicious intent.</strong></p>
      <p className='info mt-5'><strong>Copyright© Micu Florian-Luis 2023</strong></p>
    </>
  );
};

export default About;
