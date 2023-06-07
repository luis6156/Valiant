import '../../styles/auth/auth.scss';
import RegisterCard from './RegisterCard';
import RegisterForm from './RegisterForm';

const Register = () => {
  return (
    <>
      <div className='container-fluid h-100'>
        <div className='row h-100'>
          <div className='col p-0'>
            <RegisterCard />
          </div>
          <div className='col'>
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
