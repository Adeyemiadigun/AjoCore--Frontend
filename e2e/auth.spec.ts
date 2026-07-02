import { test, expect } from '@playwright/test'

test.describe('Auth pages', () => {
  test('login page has required fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('register page has password confirmation field', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('submitting empty login shows validation errors', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.locator('input:invalid')).toHaveCount(2)
  })
})
