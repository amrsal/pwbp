import { expect } from '@playwright/test';
import { constants } from '../../pages/exporter'
import { fixtures as test } from '../../pages/fixture';
const path = constants.pathTo

test.describe('Landing page Test Suite', () => {

    test.beforeEach(async ({ page, landingPage }, testinfo) => {
        testinfo.snapshotSuffix = ''
        await page.goto(path.en.landingPage, { waitUntil: "load", timeout: 30000 })
        await landingPage.waitForText('Log in')
    });

    test('Landing page is loading properly with all exact contents in EN lang', async ({ browserName, page }) => {
        expect(await page.screenshot({ fullPage: true, timeout: 4000 })).toMatchSnapshot(`${browserName}-EN.png`, { maxDiffPixels: 30, maxDiffPixelRatio: 0.04 });
    });

    test('Landing page is loading properly with all exact contents in FR lang', async ({ browserName, page }) => {
        await page.goto(path.fr.landingPage, { waitUntil: "load" })
        expect(await page.screenshot({ fullPage: true, timeout: 4000 })).toMatchSnapshot(`${browserName}-FR.png`, { maxDiffPixels: 30, maxDiffPixelRatio: 0.04  });
    });

    test('Landing page is loading properly with all exact contents in IT lang', async ({ browserName, page }) => {
        await page.goto(path.it.landingPage, { waitUntil: "load" })
        expect(await page.screenshot({ fullPage: true, timeout: 4000 })).toMatchSnapshot(`${browserName}-IT.png`, { maxDiffPixels: 30, maxDiffPixelRatio: 0.04  });
    });

    test('Landing page is loading properly with all exact contents in DE lang', async ({ browserName, page }) => {
        await page.goto(path.de.landingPage, { waitUntil: "load" })
        expect(await page.screenshot({ fullPage: true, timeout: 4000 })).toMatchSnapshot(`${browserName}-DE.png`, { maxDiffPixels: 30, maxDiffPixelRatio: 0.04  });
    });

    test('User can search for a city using IT/DE/FR lang while selected lang is EN', async ({ page, landingPage }) => {
        await landingPage.searchForCity('zurigo')
        await expect.soft(page.locator('text=Zurich >> nth=0')).toBeVisible();
        await landingPage.searchForCity('Zürich')
        await expect.soft(page.locator('text=Zurich >> nth=0')).toBeVisible();
        await landingPage.searchForCity('Genève')
        await expect.soft(page.locator('text=Geneva >> nth=0')).toBeVisible();
    });

    test('User can search for a city using EN/DE/IT lang while selected lang is FR', async ({ page, landingPage }) => {
        await page.goto(path.fr.landingPage, { waitUntil: "load" })
        await landingPage.searchForCity('zurich')
        await expect.soft(page.locator('text=zurich >> nth=0')).toBeVisible();
        await landingPage.searchForCity('Zürich')
        await expect.soft(page.locator('text=zurich >> nth=0')).toBeVisible();
        await landingPage.searchForCity('zurigo')
        await expect.soft(page.locator('text=zurich >> nth=0')).toBeVisible();
    });

    test('User can search for a city using EN/DE/FR lang while selected lang is IT', async ({ page, landingPage }) => {
        await page.goto(path.it.landingPage, { waitUntil: "load" })
        await landingPage.searchForCity('zurich')
        await expect.soft(page.locator('text=zurigo >> nth=0')).toBeVisible();
        await landingPage.searchForCity('Zürich')
        await expect.soft(page.locator('text=zurigo >> nth=0')).toBeVisible();
        await landingPage.searchForCity('Genève')
        await expect.soft(page.locator('text=Ginevra >> nth=0')).toBeVisible();
    });

    test('User can search for a city using EN/IT/FR lang while selected lang is DE', async ({ page, landingPage }) => {
        await page.goto(path.de.landingPage, { waitUntil: "load" })
        await landingPage.searchForCity('zurich')
        await expect.soft(page.locator('text=zürich >> nth=0')).toBeVisible();
        await landingPage.searchForCity('zurigo')
        await expect.soft(page.locator('text=zürich >> nth=0')).toBeVisible();
        await landingPage.searchForCity('Genève')
        await expect.soft(page.locator('text=Genf >> nth=0')).toBeVisible();
    });

    test('User can search for a canton using IT/DE/FR lang while selected lang is EN', async ({ page, landingPage }) => {
        await landingPage.searchForCity('zurigo')
        await expect.soft(page.locator('text=Zurich (ZH) >> nth=0')).toBeVisible();
        await landingPage.searchForCity('Zürich')
        await expect.soft(page.locator('text=Zurich (ZH) >> nth=0')).toBeVisible();
        await landingPage.searchForCity('Genève')
        await expect.soft(page.locator('text=Geneva (GE) >> nth=0')).toBeVisible();
    });

    test.skip('User can search for a canton using EN/DE/FR lang while selected lang is IT', async ({ page, landingPage }) => {
        await page.goto(path.it.landingPage, { waitUntil: 'networkidle' })
        await landingPage.searchForCity('zurich')
        await expect.soft(page.locator('text=Zurigo (ZH) >> nth=0')).toBeVisible();
        await landingPage.searchForCity('Zürich')
        await expect.soft(page.locator('text=Zurigo (ZH) >> nth=0')).toBeVisible();
        await landingPage.searchForCity('Genève')
        await expect.soft(page.locator('text=Ginevra (GE) >> nth=0')).toBeVisible();
    });

    test('User can search by zipCode using EN lang', async ({ page, landingPage }) => {
        await landingPage.searchForCity('8001')
        await expect.soft(page.locator('text=City Zurich, Zurich Kreis 1, Zurich, Switzerland')).toBeVisible();
        // await page.goto(path.de.landingPage, { waitUntil: "load" })
        // await landingPage.searchForCity('8003')
        // await expect.soft(page.locator('text=Wiedikon, Zürich Kreis 3, Zürich, Schweiz')).toBeVisible();
        // await page.goto(path.fr.landingPage, { waitUntil: "load" })
        // await landingPage.searchForCity('8004')
        // await expect.soft(page.locator('text=Aussersihl-Hard, Zurich Kreis 4, Zurich, Suisse')).toBeVisible();
        // await page.goto(path.it.landingPage, { waitUntil: "load" })
        // await landingPage.searchForCity('8005')
        // await expect.soft(page.locator('text=Industrie, Zurigo Kreis 5, Zurigo, Svizzera')).toBeVisible();
    });

    test('User can change language using language switcher to DE/IT/FR', async ({ page, landingPage }) => {
        await landingPage.changeLanguageTo('DE')
        await expect.soft(page).toHaveURL(path.de.landingPage);
        await landingPage.changeLanguageTo('IT')
        await expect.soft(page).toHaveURL(path.it.landingPage);
        await landingPage.changeLanguageTo('FR')
        await expect.soft(page).toHaveURL(path.fr.landingPage);
    });

    test('Recommended city link-texts for appartments are redirecting user to relevant urls', async ({ page, landingPage }) => {
        await landingPage.selectRecommendedCity('Zurich', 0)
        await expect(page).toHaveURL(path.en.zurichAppartments)
    });

    test('Recommended city link-texts for houses are redirecting user to relevant urls', async ({ page, landingPage }) => {
        await landingPage.selectRecommendedCity('Geneva', 1)
        await expect(page).toHaveURL(path.en.genevaHouses)
    });

});