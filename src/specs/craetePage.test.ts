import { expect } from '@playwright/test';
import { promises } from 'nodemailer/lib/xoauth2';
import { fixtures as test } from '../pages/fixture';


test.describe('Create page', () => {

    test.beforeEach(async ({ page, dashLoginPage }) => {
        await page.goto('/login', { waitUntil: 'domcontentloaded' })
        await dashLoginPage.LoginWith('Helga', '70LgKhaaCD40')
        await page.waitForURL('/my-dash')
        await page.goto('/dossier/create')

    })

    test('Should verify the address input showing relevant suggestions', async ({ page, createPage }) => {
        await createPage.waitForPageToBeLoaded()
        await createPage.fillTheDossierTitle('QA_Guild')
        await createPage.fillTheAddressInput('1000')
        await expect(page.locator('div[role="option"]').first()).toHaveText('Seestrasse, 1000, Meilen, Switzerland')
        await expect.soft(createPage.elementText('Seestrasse, 1000, Meilen, Switzerlands')).toBeVisible()
    })


})
