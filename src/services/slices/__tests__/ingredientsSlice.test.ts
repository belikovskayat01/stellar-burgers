import reducer, { getIngredients } from '../ingredientsSlice';
import type { TIngredient } from '@utils/types';

describe('ingredientsSlice reducer', () => {
  const initialState = {
    ingredients: [] as TIngredient[],
    isLoading: false,
    error: null as string | null
  };

  const ingredient = {
    _id: 'ingredient-1',
    id: 'ingredient-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: '',
    image_mobile:'',
    image_large:''
  } as TIngredient;

  it('возвращает начальное состояние для неизвестного экшена', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('не изменяет состояние при неизвестном экшене', () => {
    const state = {
      ...initialState,
      ingredients: [ingredient]
    };

    expect(reducer(state, { type: 'UNKNOWN' })).toEqual(state);
  });

  it('обрабатывает getIngredients.pending', () => {
    const state = {
      ...initialState,
      error: 'Старая ошибка'
    };

    expect(reducer(state, getIngredients.pending('', undefined))).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('обрабатывает getIngredients.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, isLoading: true },
        getIngredients.fulfilled([ingredient], '', undefined)
      )
    ).toEqual({
      ...initialState,
      ingredients: [ingredient]
    });
  });

  it('обрабатывает getIngredients.rejected', () => {
    expect(
      reducer(
        { ...initialState, isLoading: true },
        getIngredients.rejected(new Error('Ошибка загрузки'), '', undefined)
      )
    ).toEqual({
      ...initialState,
      error: 'Ошибка загрузки'
    });
  });
});