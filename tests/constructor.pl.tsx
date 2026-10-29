import { test, expect } from '@playwright/test';

const bun = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '/images/bun.png',
  image_large: '/images/bun-large.png',
  image_mobile: '/images/bun-mobile.png',
};

const filling = {
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: '/images/main.png',
  image_large: '/images/main-large.png',
  image_mobile: '/images/main-mobile.png',
};

test.describe('Добавление ингредиентов в конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false,
    });

    await page.goto('/');
  });

  test('добавляет булочку и начинку', async ({ page }) => {
    await page.getByRole('button', { name: 'Добавить' }).nth(0).click();

    await expect(page.getByTestId('constructor-bun-1')).toContainText(
      'Краторная булка N-200i (верх)'
    );

    await expect(page.getByTestId('constructor-bun-2')).toContainText(
      'Краторная булка N-200i (низ)'
    );

    await page.getByRole('button', { name: 'Добавить' }).nth(1).click();

    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
  });

  test('открывает и закрывает модальное окно ингредиента', async ({ page }) => {
    await page.getByText(bun.name).click();

    await expect(page.getByText(bun.name).last()).toBeVisible();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await expect(page.getByText('Белки, г')).toBeVisible();
    await expect(page.getByText('Жиры, г')).toBeVisible();
    await expect(page.getByText('Углеводы, г')).toBeVisible();

    await expect(page.getByText('420', { exact: true })).toBeVisible();
    await expect(page.getByText('80', { exact: true })).toBeVisible();
    await expect(page.getByText('24', { exact: true })).toBeVisible();
    await expect(page.getByText('53', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
  });

  test('закрывает модальное окно ингредиента по клику на оверлей', async ({ page }) => {
    await page.getByText(bun.name).click();

    await expect(page.getByTestId('modal-overlay')).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 },
    });

    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
  });

  test('оформляет заказ и очищает конструктор', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token; path=/';
    });

    await page.route('**/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            email: 'test@example.com',
            name: 'Test User',
          },
        }),
      });
    });

    await page.route('**/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            name: 'Test Order',
            order: {
              _id: 'order-1',
              status: 'done',
              name: 'Test Order',
              createdAt: '2026-01-01T10:00:00.000Z',
              updatedAt: '2026-01-01T10:00:00.000Z',
              number: 12345,
              ingredients: [bun._id, filling._id, bun._id],
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.reload();

    await page.getByRole('button', { name: 'Добавить' }).nth(0).click();
    await page.getByRole('button', { name: 'Добавить' }).nth(1).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('order-number')).toHaveText('12345');

    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 },
    });

    await expect(page.getByTestId('order-number')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-1')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-2')).not.toBeVisible();
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Выберите начинку'
    );
  });
});
