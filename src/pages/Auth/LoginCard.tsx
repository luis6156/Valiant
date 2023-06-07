const LoginCard = () => {
  return (
    <>
      <div className='auth-card login-auth-card d-flex flex-column align-items-center mb-0 overflow-hidden position-relative h-100'>
        <h1 className='logo-title'>Valiant</h1>
        <p className='p-subtitle'>by Data Pilots</p>
        <img
          className='img-plane mt-auto'
          src='/images/plane.svg'
          alt='plane'
        />
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

export default LoginCard;
