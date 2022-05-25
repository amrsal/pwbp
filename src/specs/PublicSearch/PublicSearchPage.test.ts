import { expect } from '@playwright/test';
import { constants } from '../../pages/exporter';
import { fixtures as test } from '../../pages/fixture';

const path = constants.pathTo

test.describe('Public search page Test Suite', () => {

    test.describe('Switching language', () => {

        test('Public search header is loading properly in EN lang', async ({ page, browserName, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            expect(await publicSearch.headerScreenshot()).toMatchSnapshot(`${browserName}-header-EN.png`);
        });

        test('Public search header is loading properly DE lang', async ({ page, browserName, publicSearch }) => {
            await page.goto(path.de.zurichCity, { waitUntil: "load" })
            expect(await publicSearch.headerScreenshot()).toMatchSnapshot(`${browserName}-header-DE.png`);
        });

        test('Public search header is loading properly IT lang', async ({ page, browserName, publicSearch }) => {
            await page.goto(path.it.zurichCity, { waitUntil: "load" })
            expect(await publicSearch.headerScreenshot()).toMatchSnapshot(`${browserName}-header-IT.png`);
        });

        test('Public search header is loading properly FR lang', async ({ page, browserName, publicSearch }) => {
            await page.goto(path.fr.zurichCity, { waitUntil: "load" })
            expect(await publicSearch.headerScreenshot()).toMatchSnapshot(`${browserName}-header-FR.png`);
        });

    });

    test.describe('Navigation and searching functionality', () => {

        test('User should directly naviagates to houses to buy in a city, using link-text beside main title', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.navigateToHousesInCity('Zurich')
            await expect.soft(publicSearch.housesToBuyTitle('Zurich')).toBeVisible()
        });

        test('User should directly naviagates to appartments to buy in a city, using link-text beside main title', async ({ page, publicSearch }) => {
            await page.goto(path.en.winterthurCity, { waitUntil: "load" })
            await publicSearch.navigateToAppartmentsInCity('Winterthur')
            await expect.soft(publicSearch.appartmentsToBuyTitle('Winterthur')).toBeVisible()
        });

        test('Main search result title is chaging accordingly with the selected city', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await expect.soft(publicSearch.searchResultTitle('Zurich')).toBeVisible()
            await page.goto(path.en.genevaCity, { waitUntil: "load" })
            await expect.soft(publicSearch.searchResultTitle('Geneva')).toBeVisible()
        });

        test('Search for properties in different cities, using search input', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.clearSelectedCity()
            await publicSearch.searchForCity('Gen')
            await publicSearch.selectCityFromList('Geneva')
            await expect.soft(publicSearch.searchResultTitle('Geneva')).toBeVisible()
            await publicSearch.clearSelectedCity()
            await publicSearch.searchForCity('Lausa')
            await publicSearch.selectCityFromList('Lausanne')
            await expect.soft(publicSearch.searchResultTitle('Lausanne')).toBeVisible()
        });

    });

    test.describe('Filter Functionality', () => {

        test('User is able to set price filter range for min and max value', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.openPriceFilterList()
            await publicSearch.selectFilterMinMaxPrice("300'000", "9'900'000")
            await publicSearch.clickApplyButton()
            await expect(page).toHaveURL(path.en.zurichCity + '?price-min=300000&price-max=9900000');
        });

        test('Property price query paramaters are reflecting properly on search results', async ({ page, publicSearch, dataProvider }) => {
            await page.goto(path.en.zurichCity + '?price-min=300000&price-max=9900000', { waitUntil: "load" })
            const listOfPrices = await publicSearch.getListOfPropertiesPrices()
            const checkFilterRange = dataProvider.checkValueRangeFromMinToMaX(listOfPrices, 300000, 9900000);
            expect(checkFilterRange).toBeTruthy()
        });

        test('User is able to set rooms filter range for min and max value', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.openRoomsFilter()
            await publicSearch.selectMinAndMaxRooms('2', '11')
            await publicSearch.clickApplyButton()
            await expect(page).toHaveURL(path.en.zurichCity + '?rooms-min=2&rooms-max=11');
        });

        test('Property rooms query paramaters are reflecting properly on search results', async ({ page, publicSearch, dataProvider }) => {
            await page.goto(path.en.zurichCity + '?rooms-min=2&rooms-max=11', { waitUntil: "load" })
            const listOfRooms = await publicSearch.getListOfPropertiesRoom()
            const checkFilterRange = dataProvider.checkValueRangeFromMinToMaX(listOfRooms, 2, 11);
            expect(checkFilterRange).toBeTruthy()
        });

        test('User is able to set area filter range for min and max value', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.openAreaFilter()
            await publicSearch.selectMinAndMaxArea('40', '790')
            await publicSearch.clickApplyButton()
            await expect(page).toHaveURL(path.en.zurichCity + '?area-min=40&area-max=790');
        });

        test('Property area query paramaters are reflecting properly on search results', async ({ page, publicSearch, dataProvider }) => {
            await page.goto(path.en.zurichCity + '?area-min=40&area-max=790', { waitUntil: "load" })
            const listOfAreas = await publicSearch.getListOfPropertiesAreas()
            const checkFilterRange = dataProvider.checkValueRangeFromMinToMaX(listOfAreas, 40, 790);
            expect(checkFilterRange).toBeTruthy()
        });

        test('User is able to set radius filter parameters', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.openRadiusFilter()
            await publicSearch.selectRadiusValue('5')
            await publicSearch.clickApplyButton()
            await expect(page).toHaveURL(path.en.zurichCity + '?radius=5');
        });

        test('User is able to set property filter type parameters as apartments', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.openMoreFilters()
            await publicSearch.selectPropertyType('House')
            await publicSearch.clickApplyButton()
            await expect(page).toHaveURL(path.en.zurichCity + '/apartments?isExclusiveProperty=true&isMoneyPark=true&isPublic=true');
        });

        test('User is able to set property filter type parameters as houses', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.openMoreFilters()
            await publicSearch.selectPropertyType('Apartment')
            await publicSearch.clickApplyButton()
            await expect(page).toHaveURL(path.en.zurichCity + '/houses?isExclusiveProperty=true&isMoneyPark=true&isPublic=true');
        });

        test('User is able to set min & max building year as filter parameters', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.openMoreFilters()
            await publicSearch.selectMinAndMaxBuildingYear('1930', '2024')
            await publicSearch.clickApplyButton()
            await expect(page).toHaveURL(path.en.zurichCity + '?type=house%2Capartment&isExclusiveProperty=true&isMoneyPark=true&isPublic=true&year-min=1930&year-max=2024');
        });

        test('User is able to set general amenities as filter parameters', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.openMoreFilters()
            await publicSearch.setGeneralAmenities()
            await publicSearch.clickApplyButton()
            await expect(page).toHaveURL(path.en.zurichCity + '?type=house%2Capartment&isExclusiveProperty=true&isMoneyPark=true&isPublic=true&parking=true&elevator=true&wheelchair=true');
        });

        test('MoneyPark offering filter section should be checked by default', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.openMoreFilters()
            await publicSearch.checkMoneyParkOfferingFilter()
            await expect(await publicSearch.checkMoneyParkOfferingFilter()).toBeTruthy()
        });

        test.only('User is able to set all compinations of filter parameters', async ({ page, publicSearch }) => {
            await page.goto(path.en.zurichCity, { waitUntil: "load" })
            await publicSearch.openPriceFilterList()
            await publicSearch.selectFilterMinMaxPrice("300'000", "9'900'000")
            await publicSearch.clickApplyButton()
            await publicSearch.openRoomsFilter()
            await publicSearch.selectMinAndMaxRooms('2', '11')
            await publicSearch.clickApplyButton()
            await publicSearch.openAreaFilter()
            await publicSearch.selectMinAndMaxArea('40', '790')
            await publicSearch.clickApplyButton()
            await publicSearch.openRadiusFilter()
            await publicSearch.selectRadiusValue('5')
            await publicSearch.clickApplyButton()
            await publicSearch.openMoreFilters()
            await publicSearch.selectMinAndMaxBuildingYear('1930', '2024')
            await publicSearch.clickApplyButton()
            await publicSearch.openMoreFilters()
            await publicSearch.setGeneralAmenities()
            await publicSearch.clickApplyButton()
            await expect(page).toHaveURL(path.en.zurichCity + '?price-min=300000&price-max=9900000&rooms-min=2&rooms-max=11&area-min=40&area-max=790&radius=5&type=house%2Capartment&isExclusiveProperty=true&isMoneyPark=true&isPublic=true&year-min=1930&year-max=2024&parking=true&elevator=true&wheelchair=true', { timeout: 11000 });
        });

    });

    test('Properties search results price are sorted Asc by default', async ({ page, publicSearch, dataProvider }) => {
        await page.goto(path.en.zurichCity, { waitUntil: "load" })
        await publicSearch.clickOnSortingIcon()
        await publicSearch.sortByPrice('Low to High')
        const listOfPrices = await publicSearch.getListOfPropertiesPrices()
        expect(await dataProvider.checkArrOfNumberSorting(listOfPrices)).toBe('Ascending')
    });

    test('Properties search results price can be sorted by price in Desc order', async ({ page, publicSearch, dataProvider }) => {
        await page.goto(path.en.zurichCity, { waitUntil: "load" })
        await publicSearch.clickOnSortingIcon()
        await publicSearch.sortByPrice('High to Low')
        const listOfPrices = await publicSearch.getListOfPropertiesPrices()
        console.log(listOfPrices)
        await expect.soft(page).toHaveURL(path.en.zurichCity + '?sortField=salePrice&orderDirection=desc')
        expect(await dataProvider.checkArrOfNumberSorting(listOfPrices)).toBe('Descending')
    });

    test('Property should be pinned on the map with its price', async ({ page, publicSearch }) => {
        await page.goto(path.en.zurichCity, { waitUntil: "load" })
        const listOfPrices = await publicSearch.converPricetoBe$$$K()
        await expect(publicSearch.priceOnMap(listOfPrices)).toBeVisible()
    });

    test('Popup property info on map are matching info on search results card', async ({ page, publicSearch }) => {
        await page.goto(path.en.zurichCity, { waitUntil: "load" })
        const listOfPrices = await publicSearch.converPricetoBe$$$K()
        await publicSearch.priceOnMap(listOfPrices).click()
        const propertyInfo = await publicSearch.getPropertyInfo()
        await expect(publicSearch.appartmentPopUpInfo(propertyInfo.area, propertyInfo.rooms, propertyInfo.meterPrice, propertyInfo.price)).toBeVisible()
    });

    test('Search with more than once city', async ({ page, publicSearch }) => {
        await page.goto(path.en.zurichCity, { waitUntil: "load" })
        await publicSearch.addOneMoreCityForSearch('Gen')
        await publicSearch.selectCityFromList('Geneva')
        await expect.soft(publicSearch.searchResultTitle('Geneva, Zurich')).toBeVisible()
        await expect(page).toHaveURL(new RegExp('/en/properties/buy/search\\?locations=.*'));
    });

    test('User can navigate for more search results using pagination', async ({ page, publicSearch }) => {
        await page.goto(path.en.zurichCity, { waitUntil: "load" })
        await publicSearch.clickOnPaginationIcon('2')
        await expect.soft(page).toHaveURL('/en/properties/buy/city-zurich?page=2');
        await publicSearch.clickOnFirstIcon()
        await expect.soft(page).toHaveURL('/en/properties/buy/city-zurich?page=1');
    });

});