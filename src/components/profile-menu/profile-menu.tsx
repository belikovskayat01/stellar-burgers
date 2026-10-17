import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from '@services/slices/userSlice';
import { useDispatch } from '@services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(logoutUser()).unwrap();
      void navigate('/login', { replace: true });
    } catch (error) {
      console.error('Не удалось выйти из аккаунта:', error);
    }
  };

  return (
    <ProfileMenuUI
      handleLogout={() => {
        void handleLogout();
      }}
      pathname={pathname}
    />
  );
};
