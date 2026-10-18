import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { type Location, useLocation, useNavigate } from 'react-router-dom';

import { registerUser } from '@services/slices/userSlice';
import { useDispatch } from '@services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from;

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setErrorText('');

    try {
      await dispatch(
        registerUser({
          email,
          password,
          name: userName,
        })
      ).unwrap();

      void navigate(from?.pathname ?? '/', { replace: true });
    } catch (error) {
      setErrorText(
        typeof error === 'string'
          ? error
          : 'Не удалось зарегистрироваться. Проверьте введенные данные.'
      );
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={(e) => {
        void handleSubmit(e);
      }}
    />
  );
};
