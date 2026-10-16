
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '@services/store';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: TProtectedRouteProps): React.JSX.Element => {
  const isAuthenticated = useSelector(
    (state) => state.user.isAuthenticated
  );

  const isLoading = useSelector((state) => state.user.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
};
