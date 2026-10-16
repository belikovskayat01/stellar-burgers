import { AppHeader, Modal, OrderInfo, IngredientDetails, ProtectedRoute } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Preloader } from '@ui';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getUser } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';
import { getIngredients } from '@services/slices/ingredientsSlice';
import type { AppContentProps } from './type';

import '../../index.css';
import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getIngredients());
  }, [dispatch]);

  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );
  const ingredientsError = useSelector(
    (state) => state.ingredients.error
  );

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

const AppContent = ({
  isLoading,
  error
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты: {error}
      </p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<ConstructorPage />} />
      <Route path="/feed" element={<Feed />} />
      <Route
        path="/feed/:number"
        element={
          <Modal title="Информация о заказе" onClose={() => navigate(-1)}>
            <OrderInfo />
          </Modal>
        }
      />
      <Route
        path="/ingredients/:id"
        element={
          <Modal title="Детали ингредиента" onClose={() => navigate(-1)}>
            <IngredientDetails />
          </Modal>
        }
      />
      <Route
        path="/login"
        element={
          <ProtectedRoute onlyUnAuth>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute onlyUnAuth>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ProtectedRoute onlyUnAuth>
            <ForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <ProtectedRoute onlyUnAuth>
            <ResetPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/orders"
        element={
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/orders/:number"
        element={
          <ProtectedRoute>
            <Modal title="Информация о заказе" onClose={() => navigate(-1)}>
              <OrderInfo />
            </Modal>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};