import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { orderBurger, clearConstructor } from '@services/slices/burgerConstructorSlice';
import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.burgerConstructor);

  const orderRequest = useSelector((state) => state.burgerConstructor.orderRequest);

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const orderModalData = useSelector((state) => state.burgerConstructor.order);

  const onOrderClick = (): void => {
    if (!isAuthenticated) {
      void navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(orderBurger(ingredients));
  };

  const closeOrderModal = (): void => {
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
