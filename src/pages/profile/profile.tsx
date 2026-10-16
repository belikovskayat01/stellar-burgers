import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { updateUser } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';

export const Profile = (): React.JSX.Element => {
  const user = useSelector((state) => state.user.user);
  const updateUserError = useSelector((state) => state.user.error ?? undefined);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || '',
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    const data: {
      name?: string;
      email?: string;
      password?: string;
    } = {
      name: formValue.name,
      email: formValue.email,
    };

    if (formValue.password) {
      data.password = formValue.password;
    }


    try {
      await dispatch(updateUser(data)).unwrap();

      setFormValue((prevState) => ({
        ...prevState,
        password: '',
      }));
    } catch {

    }
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
