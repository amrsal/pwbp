import { expect } from '@playwright/test';
import { promises } from 'nodemailer/lib/xoauth2';
import { fixtures as test } from '../pages/fixture';


test.describe('Dash login page', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login', { waitUntil: 'domcontentloaded' })
    })

    test('Should login with valid credential', async ({ page, dashLoginPage }) => {
        await dashLoginPage.LoginWith('Helga', '70LgKhaaCD40')
        await expect(page).toHaveURL('https://dash.pricehubble.com/my-dash');
    })

    test('Should not be able to login with invalid credential', async ({ page, dashLoginPage }) => {
        await dashLoginPage.LoginWith('Helga', '70LgKhaaCDw40')
        const errorplaceHolder = await page.locator('//div[@class="dib-alerts__text"]//p')
        await expect(await errorplaceHolder.textContent()).toBe('Wrong username or password')
    })

    test.only('Should return 401 when loging with invalid credential', async ({ page, dashLoginPage }) => {
        await dashLoginPage.waitForResponseAndVerifyStatus('Helga', '70LgKhaaCDw40', 401)
    })

})
