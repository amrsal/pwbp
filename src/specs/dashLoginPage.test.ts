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

    test('Should return 401 when loging with invalid credential', async ({ page, dashLoginPage }) => {
        await dashLoginPage.waitForResponseAndVerifyStatus('Helga', '70LgKhaaCDw40', 401)
    })

    test.only('Screenshot matching test case for dash in EN', async ({ page, dashLoginPage, browserName }) => {
        await dashLoginPage.PHLogo.waitFor()
        await expect(page).toHaveScreenshot(`${browserName}-EN.png`)
        // expect(await page.screenshot({ fullPage: true, timeout: 4000 })).toMatchSnapshot(`${browserName}-EN.png`, { maxDiffPixels: 30, maxDiffPixelRatio: 0.04 });

    })

    test.only('Screenshot matching test case for dash in DE', async ({ page, dashLoginPage, browserName }) => {
        await dashLoginPage.switchLanguageTo('Deutsch')
        await expect(page).toHaveScreenshot(`${browserName}-DE.png`)
        // expect(await page.screenshot({ fullPage: true, timeout: 4000 })).toMatchSnapshot(`${browserName}-EN.png`, { maxDiffPixels: 30, maxDiffPixelRatio: 0.04 });

    })

    test.only('Screenshot matching test case for dash in IT', async ({ page, dashLoginPage, browserName }) => {
        await dashLoginPage.switchLanguageTo('Italiano')
        await expect(page).toHaveScreenshot(`${browserName}-IT.png`)
        // expect(await page.screenshot({ fullPage: true, timeout: 4000 })).toMatchSnapshot(`${browserName}-EN.png`, { maxDiffPixels: 30, maxDiffPixelRatio: 0.04 });

    })

    test.only('Screenshot matching test case for dash in JP', async ({ page, dashLoginPage, browserName }) => {
        await dashLoginPage.switchLanguageTo('日本語')
        await expect(page).toHaveScreenshot(`${browserName}-JP.png`)
        // expect(await page.screenshot({ fullPage: true, timeout: 4000 })).toMatchSnapshot(`${browserName}-EN.png`, { maxDiffPixels: 30, maxDiffPixelRatio: 0.04 });

    })



})
