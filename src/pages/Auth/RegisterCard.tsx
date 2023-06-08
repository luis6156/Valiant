const RegisterCard = () => {
  return (
    <>
      <div className='auth-card register-auth-card d-flex flex-column align-items-center mb-0 overflow-hidden position-relative h-100'>
        <p className='p-quote'>
          Equip yourself with the basics, learn how{' '}
          <b className='accent-color'>OSINT</b> and{' '}
          <b className='accent-color'>Pentesting</b> may help you and your
          business. Thank you for choosing us!
        </p>
        <p className='p-quote-author'>— Data Pilots Team</p>
        <img
          className='img-cloud-front'
          src='/images/cloud_1.svg'
          alt='cloud'
        />
        <img className='img-cloud-back' src='/images/cloud_2.svg' alt='cloud' />
      </div>
    </>
  );
};

export default RegisterCard;
