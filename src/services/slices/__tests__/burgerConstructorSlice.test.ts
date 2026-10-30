import reducer, {
  initialState,
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  orderBurger,
} from '../burgerConstructorSlice';

import type { TConstructorIngredient } from '@utils-types';

describe('burgerConstructorSlice reducer', () => {

  const bun = {
    _id: 'bun-1',
    id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: '',
  } as TConstructorIngredient;

  const ingredient1 = {
    ...bun,
    _id: 'ingredien-t',
    id: 'ingredient-1',
    name: 'Котлета',
    type: 'main',
  } as TConstructorIngredient;

  const ingredient2 = {
    ...bun,
    _id: 'ingredient-2',
    id: 'ingredient-2',
    name: 'Сыр',
    type: 'main',
  } as TConstructorIngredient;

  it('возвращает начальное состояние для неизвестного экшена', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('не изменяет состояние при неизвестном экшене', () => {
    const state = {
      ...initialState,
      ingredients: [ingredient1],
    };

    expect(reducer(state, { type: 'UNKNOWN' })).toEqual(state);
  });

  it('добавляет булку', () => {
    expect(reducer(initialState, addBun(bun))).toEqual({
      ...initialState,
      bun,
    });
  });

  it('добавляет начинку', () => {
    expect(reducer(initialState, addIngredient(ingredient1))).toEqual({
      ...initialState,
      ingredients: [ingredient1],
    });
  });

  it('удаляет начинку по id', () => {
    const state = {
      ...initialState,
      ingredients: [ingredient1, ingredient2],
    };

    expect(reducer(state, removeIngredient('ingredient-1'))).toEqual({
      ...initialState,
      ingredients: [ingredient2],
    });
  });

  it('перемещает начинку', () => {
    const state = {
      ...initialState,
      ingredients: [ingredient1, ingredient2],
    };

    expect(reducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }))).toEqual({
      ...initialState,
      ingredients: [ingredient2, ingredient1],
    });
  });

  it('очищает конструктор', () => {
    const order = {
      _id: 'order-1',
      status: 'done',
      name: 'Тестовый бургер',
      createdAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z',
      number: 123,
      ingredients: ['ingredient-1'],
    };

    const state = {
      ...initialState,
      bun,
      ingredients: [ingredient1],
      order,
    };

    expect(reducer(state, clearConstructor())).toEqual(initialState);
  });

  it('обрабатывает orderBurger.pending', () => {
    const state = {
      ...initialState,
      orderError: 'Старая ошибка',
    };

    expect(reducer(state, orderBurger.pending('', []))).toEqual({
      ...initialState,
      orderRequest: true,
      orderError: null,
    });
  });

  it('обрабатывает orderBurger.fulfilled', () => {
    const order = {
      _id: 'order-1',
      status: 'done',
      name: 'Тестовый бургер',
      createdAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z',
      number: 123,
      ingredients: ['ingredient-1'],
    };
    const state = {
      ...initialState,
      bun,
      ingredients: [ingredient1],
      orderRequest: true,
    };

    expect(reducer(state, orderBurger.fulfilled(order, '', []))).toEqual({
      ...initialState,
      order,
    });
  });

  it('обрабатывает orderBurger.rejected', () => {
    expect(
      reducer(
        { ...initialState, orderRequest: true },
        orderBurger.rejected(new Error('Ошибка заказа'), '', [])
      )
    ).toEqual({
      ...initialState,
      orderError: 'Ошибка заказа',
    });
  });
});
