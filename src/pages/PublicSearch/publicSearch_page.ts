import { Page } from "playwright-core";
import { DataProvider } from "../exporter";


export default class PublicSearch {

    private page: Page

    constructor(page: Page) {
        this.page = page;
    }

    /********************************************************** Elements ********************************************************* */

    textElement(text: string) { return this.page.locator(`text=${text}`) }
    get navigationHeader() { return this.page.locator('div[role="navigation"]') }
    get removeSelectedCity() { return this.page.locator('text=remove') }
    searchResultTitle(city: string) { return this.page.locator(`text=/\\d+ properties for sale in ${city} - Find all properties with MoneyPark/`) }
    get searchInput() { return this.page.locator('input[placeholder="Add another city"]') }
    get searchInputForAnotherCity() { return this.page.locator('text=Add another city') }
    get fillCityName() { return this.page.locator('[placeholder="Add\\ another\\ city"]') }
    priceOnMap(text: string) { return this.page.locator(`//div[contains(@class,"PropertiesMarkers_marker") and text()="${text}"]`) }
    searchedCity(city: string) { return this.page.locator(`li[role="option"]:has-text("${city}") >> nth=0`) }
    housesInCityLink(city: string) { return this.page.locator(`text=Houses to buy in ${city}`) }
    housesToBuyTitle(city: string) { return this.page.locator(`text=/\\d+ houses to buy in ${city}/`) }
    appartmentsInCityLink(city: string) { return this.page.locator(`text=Apartments for sale in ${city}`) }
    appartmentsToBuyTitle(city: string) { return this.page.locator(`text=/\\d+ apartments for sale in ${city} with MoneyPark/`) }
    get priceFilterList() { return this.page.locator(`div[role="button"]:has-text("CHF 200K - 30M") >> nth=0`) }
    get roomsFilterList() { return this.page.locator(`div[role="button"]:has-text("1 - 12 Rooms") >> nth=0`) }
    get areaFilterList() { return this.page.locator(`div[role="button"]:has-text("20 - 800m²") >> nth=0`) }
    get radiusFilterList() { return this.page.locator(`div[role="button"]:has-text("No radius") >> nth=0`) }
    get moreFilters() { return this.page.locator(`//span[text()="More filters"] >> nth=0`) }
    propertyType(type: string) { return this.page.locator(`div[role="button"]:has-text("${type}")`) }


    selectPriceValue(price: string) { return this.page.locator(`//div[contains(@class, 'OptionsList') and text()="${price}"]`) }
    radiusValue(radius: string) { return this.page.locator(`div[role="button"]:has-text("${radius}") >> nth=0`) }

    selectNumberOfRooms(rooms: string) { return this.page.locator(`//div[contains(@class, 'OptionsList') and text()="${rooms}"]`) }
    get listOfMinBuildingYear() { return this.page.locator('input[name="min"]') }
    get listOfMaxBuildingYear() { return this.page.locator('text=Max >> input[type="text"]') }

    get applyButton() { return this.page.locator('button:has-text("Apply")') }
    get listOfPropertiesPrices() { return this.page.locator('//span[contains(@class,"SearchItemContent_value")]') }
    get listOfPropertiesRooms() { return this.page.locator('//span[contains(@class,"SearchItemContent_parameter") and text()="Rooms"]') }
    get listOfPropertiesAreas() { return this.page.locator('//span[contains(@class,"SearchItemContent_parameter") and text()="m"]') }
    get parkingSpace() { return this.page.locator('#parkingSpaces-checkbox') }
    get elevator() { return this.page.locator('#elevator-checkbox') }
    get wheelchairAccess() { return this.page.locator('#wheelchairAccess-checkbox') }
    get sortingIcon() { return this.page.locator('div[role="button"]:has-text("Price")') }
    appartmentPopUpInfo(area: string, rooms: string, mPrice: string, price: string) { return this.page.locator(`text=Living Area:${area} m²Rooms:${rooms}Price per m²:CHF ${mPrice}Price:CHF ${price}`) }
    buttonHasText(index: string) { return this.page.locator(`button:has-text("${index}")`) }
    get FirstIcon() { return this.page.locator('[aria-label="Jump\\ to\\ first\\ page"]') }
    get langSwitcher() { return this.page.locator(`button[role="menuitem"]`) }
    langSwitcherList(lang: string) { return this.page.locator(`a[title="${lang}"]:has-text("${lang}") >> nth=0`) }
    get preSaleProperty() { return this.page.locator(`#isExclusiveProperty-checkbox`) }
    get MPProperty() { return this.page.locator('#isMoneyPark-checkbox') }
    get publicProperty() { return this.page.locator('#isPublic-checkbox') }


    /********************************************************** Actions ********************************************************* */

    async waitForSearchTitleToBeVisible(city: string) {
        return this.searchResultTitle(city).waitFor()
    }

    async headerScreenshot() {
        await this.navigationHeader.waitFor({ state: "visible" })
        return this.navigationHeader.screenshot()
    }

    async clearSelectedCity() {
        await this.removeSelectedCity.waitFor()
        await this.removeSelectedCity.click()
        await this.removeSelectedCity.isHidden()
        return this;
    }

    async searchForCity(value: any) {
        await this.searchInput.waitFor()
        await this.searchInput.type(value, { delay: 70 })
        return this;
    }

    async addOneMoreCityForSearch(value: any) {
        await this.searchInputForAnotherCity.waitFor()
        await this.searchInputForAnotherCity.click()
        await this.fillCityName.type(value, { delay: 70 })
        return this;
    }

    async selectCityFromList(city: any) {
        await this.searchedCity(city).waitFor()
        await Promise.all([
            this.page.waitForNavigation(),
            this.searchedCity(city).click()
        ]);
        return this;
    }

    async navigateToHousesInCity(city: any) {
        // await Promise.all([
        //     this.page.waitForNavigation(),
            this.housesInCityLink(city).click()
        // ]);
        return this;
    }

    async navigateToAppartmentsInCity(city: any) {
        await Promise.all([
            this.page.waitForNavigation(),
            this.appartmentsInCityLink(city).click()
        ]);
        return this;
    }

    async openPriceFilterList() {
        await this.priceFilterList.click()
        return this;
    }

    async openRoomsFilter() {
        await this.roomsFilterList.click()
        return this;
    }

    async openAreaFilter() {
        await this.areaFilterList.click()
        return this;
    }

    async openRadiusFilter() {
        await this.radiusFilterList.click()
        return this;
    }

    async openMoreFilters() {
        await this.moreFilters.waitFor()
        await this.moreFilters.click()
        try {
            await this.parkingSpace.waitFor({timeout:5000})
        } catch {
            await this.moreFilters.waitFor()
            await this.moreFilters.click()
            await this.parkingSpace.waitFor({timeout:5000})
        }
        return this;
    }

    async selectRadiusValue(radius: string) {
        await this.radiusValue(radius).waitFor()
        await this.radiusValue(radius).click()
        return this;
    }

    async selectPropertyType(type: string) {
        await this.propertyType(type).waitFor()
        await this.propertyType(type).click()
        return this;
    }

    async selectFilterMinMaxPrice(min: string, max: string) {
        await this.selectPriceValue(min).waitFor()
        await this.selectPriceValue(min).click()
        await this.selectPriceValue(max).click()
        return this;
    }

    async selectMinAndMaxRooms(min: string, max: string) {
        await this.selectNumberOfRooms(min).waitFor()
        await this.selectNumberOfRooms(min).click()
        await this.selectNumberOfRooms(max).click()
        return this;
    }

    async selectMinAndMaxArea(min: string, max: string) {
        await this.selectNumberOfRooms(min).waitFor()
        await this.selectNumberOfRooms(min).click()
        await this.selectNumberOfRooms(max).click()
        return this;
    }

    async selectMinAndMaxBuildingYear(min: string, max: string) {
        await this.listOfMinBuildingYear.waitFor()
        await this.listOfMinBuildingYear.click()
        await this.textElement(min).waitFor()
        await this.textElement(min).click()
        await this.listOfMaxBuildingYear.click()
        await this.textElement(max).click()
        return this;
    }

    async checkMoneyParkOfferingFilter() {
        if (await this.preSaleProperty.isChecked() && await this.MPProperty.isChecked() && await this.publicProperty.isChecked()) {
            return true;
        } else {
            return false;
        }
    }

    async setGeneralAmenities() {
        await this.parkingSpace.check()
        await this.elevator.check()
        await this.wheelchairAccess.check()
        return this;
    }

    async handleNavigation() {
        try {
            await this.page.waitForNavigation({ timeout: 70000 })
        } catch {
            console.log('Navigation is timedout, page will be reloaded!')
            await this.page.reload({ waitUntil: "load" })
        }
    }

    async clickApplyButton() {
        await Promise.all([
             this.page.waitForNavigation(),
             this.applyButton.click()
        ]);
        return this;
    }

    async sortByPrice(sortBy: string) {
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.locator(`div[role="button"]:has-text("Price (${sortBy})")`).nth(1).click()
        ]);
    }

    async getListOfPropertiesPrices() {
        let listOfPrices = []
        const listOFItems = await this.listOfPropertiesPrices.allInnerTexts()
        for await (let prop of listOFItems) {
            const itemPrice = prop.split("'").join("")
            listOfPrices.push(itemPrice)
        }
        return listOfPrices.map(Number)
    }

    async converPricetoBe$$$K() {
        const data = new DataProvider
        let listOfPrices = []
        const listOFItems = await this.listOfPropertiesPrices.allInnerTexts()
        for await (let itemsPrices of listOFItems) {
            const convertToNumber = parseFloat(itemsPrices.replace(/\D/g, ""))
            const itemPrice = data.formatPrice(convertToNumber)
            // const itemPrice = itemsPrices.replace("'000", 'K')
            listOfPrices.push(itemPrice)
        }
        return listOfPrices[0]
    }

    async getListOfPropertiesRoom() {
        let listOfRooms = []
        const listOFItems = await this.listOfPropertiesRooms.allInnerTexts()
        for await (let rooms of listOFItems) {
            const room = rooms.split(" Rooms").join("")
            listOfRooms.push(room)
        }
        console.log('List of properties rooms -->')
        console.log(listOfRooms)
        return listOfRooms.map(Number)
    }

    async getPropertyInfo() {
        const dataProvider = new DataProvider
        let info = {}
        const propArea = (await this.listOfPropertiesAreas.first().allInnerTexts())[0]
        const propRooms = (await this.listOfPropertiesRooms.first().allInnerTexts())[0].split(" Rooms").join("")
        const propPrice = (await this.listOfPropertiesPrices.first().allInnerTexts())[0]
        const pricePerMeter = ~~(parseInt(propPrice.split("'").join("")) / parseInt(propArea))
        const formatPicePerMeter = pricePerMeter.toLocaleString().replace(",", "'")
        return Object.assign(info, { area: parseInt(propArea).toString(), rooms: propRooms, price: propPrice, meterPrice: formatPicePerMeter })
    }

    async getListOfPropertiesAreas() {
        let listOfAreas = []
        const listOfProps = await this.listOfPropertiesAreas.allInnerTexts()
        for await (let areas of listOfProps) {
            const area = areas.split('m2').join('')
            listOfAreas.push(area)
        }
        console.log('List of properties area -->')
        console.log(listOfAreas)
        return listOfAreas
    }

    async clickOnSortingIcon() {
        await this.page.locator('div[role="button"]:has-text("Sort by: ")').click()
        return this;
    }

    async changeLanguageTo(lang: string) {
        await this.langSwitcher.hover()
        await this.langSwitcherList(lang).click()
        return this;
    }

    async selectRecommendedCity(city: string, index: number) {
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.locator(`text=${city} >> nth=${index}`).first().click()
        ]);
        return this;
    }

    async clickOnPaginationIcon(value: string) {
        await Promise.all([
            this.page.waitForNavigation(),
            this.buttonHasText(value).click()
        ]);
    }

    async clickOnFirstIcon() {
        await Promise.all([
            this.page.waitForNavigation(),
            this.FirstIcon.click()
        ]);
    }

    async open(url: string) {
        await this.page.goto(url, { waitUntil: "load" })
        return this;
    }

}
