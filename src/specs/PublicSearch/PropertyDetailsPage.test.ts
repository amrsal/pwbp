import { expect } from '@playwright/test';
import { constants } from '../../pages/exporter';
import { fixtures as test } from '../../pages/fixture';

const path = constants.pathTo
let info, interestRatePage;

test.describe('Property Details Page Test Suite', () => {

    test.afterEach(async ({ page }) => {
        await page.close()
    });

    test('Clicking on property card will redirect user to the property details page', async ({ page, propertyDetails }) => {
        await page.goto(path.en.zurichCity, { waitUntil: "load" })
        await propertyDetails.selectPropertyByIndexNumber(1)
        await expect(page).toHaveURL(new RegExp('/en/properties/buy/property/\\.*'));
    });

    test('Property info appears on property card are matching info on property detail page', async ({ page, propertyDetails }) => {
        await page.goto(path.en.zurichCity, { waitUntil: "load" })
        info = await propertyDetails.getPropertyInfo(path.en.room, path.en.type, 1)
        await propertyDetails.selectPropertyByIndexNumber(1)
        await expect.soft(propertyDetails.pdpPrice).toHaveText(info.price)
        await expect.soft(propertyDetails.pdpRooms(path.en.room)).toHaveText(info.rooms)
        await expect.soft(propertyDetails.pdpArea).toHaveText(info.area)
        await expect.soft(propertyDetails.pdpType).toHaveText(info.type)
        await expect.soft(propertyDetails.pdpAddress).toHaveText(new RegExp(`\\d+ ${info.address}`))
    });

    test('Back to search on PDP should leads to search results page', async ({ page, propertyDetails }) => {
        await page.goto(path.en.zurichCity, { waitUntil: "load" })
        await propertyDetails.selectPropertyByIndexNumber(1)
        await propertyDetails.navigateBackWord()
        await expect(page).toHaveURL(path.en.zurichCity);
    });

    test('User is able to copy property link', async ({ page, propertyDetails }) => {
        await page.goto(path.en.zurichCity, { waitUntil: "load" })
        await propertyDetails.selectPropertyByIndexNumber(1)
        await propertyDetails.clickOnShareIcon()
        await propertyDetails.clickOnCopyLink()
        await expect(await page.evaluate(() => navigator.clipboard.readText()))
            .toEqual(page.url());
    });

    test('User is able to navigate to personal interest rate calculator', async ({ page, propertyDetails }) => {
        await page.goto(path.en.zurichCity, { waitUntil: "load" })
        info = await propertyDetails.getPropertyInfos(path.en.room, path.en.type, 1)
        await propertyDetails.selectPropertyByIndexNumber(1)
        interestRatePage = await propertyDetails.calculateInterestRatePage()
        console.log(info.address)
        expect(interestRatePage.url().includes(`/en/the-simplest-way/form/?price=${info.price}&zipcode`)).toBeTruthy()
    });

    test('User is able to navigate to personal interest rate calculator with it language', async ({ page, propertyDetails }) => {
        await page.goto(path.it.zurichCity, { waitUntil: "load" })
        info = await propertyDetails.getPropertyInfos(path.it.room, path.it.type, 1)
        await propertyDetails.selectPropertyByIndexNumber(1)
        interestRatePage = await propertyDetails.calculateInterestRatePage()
        console.log('IT: ' + interestRatePage.url())
        expect(interestRatePage.url().includes(`/it/la-ipoteca-piu-semplice/form/?price=${info.price}&zipcode`)).toBeTruthy()
    });

    test('User is able to navigate to personal interest rate calculator with FR language', async ({ page, propertyDetails }) => {
        await page.goto(path.fr.zurichCity, { waitUntil: "load" })
        info = await propertyDetails.getPropertyInfos(path.fr.room, path.fr.type, 1)
        await propertyDetails.selectPropertyByIndexNumber(1)
        interestRatePage = await propertyDetails.calculateInterestRatePage()
        console.log('Fr: ' + interestRatePage.url())
        expect(interestRatePage.url().includes(`/fr/pret-hypothecaire-le-plus-simple/form/?price=${info.price}&zipcode`)).toBeTruthy()
    });

    test('User is able to navigate to personal interest rate calculator with DE language', async ({ page, propertyDetails }) => {
        await page.goto(path.de.zurichCity, { waitUntil: "load" })
        info = await propertyDetails.getPropertyInfos(path.de.room, path.de.type, 1)
        await propertyDetails.selectPropertyByIndexNumber(1)
        interestRatePage = await propertyDetails.calculateInterestRatePage()
        console.log('DE: ' + interestRatePage.url())
        expect(interestRatePage.url().includes(`/die-einfachste-hypothek/form/?price=${info.price}&zipcode`)).toBeTruthy()
    });

});