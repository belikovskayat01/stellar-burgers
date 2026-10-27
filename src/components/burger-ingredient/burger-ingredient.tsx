import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import { addBun, addIngredient } from '@services/slices/burgerConstructorSlice';
import { useDispatch } from '@services/store';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
  count,
}: TBurgerIngredientProps): React.JSX.Element {
  const location = useLocation();

  const dispatch = useDispatch();

  const handleAdd = (): void => {
    const constructiorIngredient = {
      ...ingredient,
      id: crypto.randomUUID(),
    };

    if (ingredient.type === 'bun') {
      dispatch(addBun(constructiorIngredient));
    } else {
      dispatch(addIngredient(constructiorIngredient));
    }
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});
