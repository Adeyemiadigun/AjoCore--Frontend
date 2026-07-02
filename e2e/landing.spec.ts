import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('renders hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Save Together/ })).toBeVisible()
  })

  test('navigation links work', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /Sign In/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Start Saving Free/i }).first()).toBeVisible()
  })

  test('signup link navigates to register', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /Start Saving Free/i })
      .first()
      .click()
    await expect(page).toHaveURL('/register')
  })
})
