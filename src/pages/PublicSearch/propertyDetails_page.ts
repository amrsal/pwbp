import { Page } from "playwright-core";
import { DataProvider } from "../exporter";

export default class PropertyDetails {

    private page: Page

    constructor(page: Page) {
        this.page = page;
    }

    /********************************************************** Elements ********************************************************* */
    selectProperty(index: number) { return this.page.locator(`//article[contains(@class,"SearchResultsItem_item")] >> nth=${index}`) }
    propertyPrice(index: number) { return this.page.locator(`//span[contains(@class,"SearchItemContent_value")] >> nth=${index}`) }
    propertyRooms(room: string, index: number) { return this.page.locator(`//span[contains(@class,"SearchItemContent_parameter") and text()="${room}"] >> nth=${index}`) }
    propertyArea(index: number) { return this.page.locator(`//span[contains(@class,"SearchItemContent_parameter") and text()="m"] >> nth=${index}`) }
    propertyType(type: string, index: number) { return this.page.locator(`//span[contains(@class,"SearchItemContent_type") and text()="${type}"] >> nth=${index}`) }
    propertyAddress(index: number) { return this.page.locator(`//address[contains(@class,"SearchItemContent_address")] >> nth=${index}`) }
    get pdpPrice() { return this.page.locator('//span[contains(@class,"Parameters-module_price")]') }
    pdpRooms(room: string) { return this.page.locator(`//span[contains(@class,"Parameters-module_feature") and text()="${room}"]`) }
    get pdpArea() { return this.page.locator('//span[contains(@class,"Parameters-module_feature") and text()="m²"]') }
    get pdpType() { return this.page.locator('//span[contains(@class,"Parameters-module_feature")]') }
    get pdpAddress() { return this.page.locator('//address[contains(@class,"Parameters-module_address")]') }

    get backButton() { return this.page.locator('button:has-text("Back to search")') }
    get shareButton() { return this.page.locator('//button[contains(@class,"Share_shareText")]') }
    get copyLink() { return this.page.locator('//div[contains(@class,"Share_shareItem")]') }
    z() { return this.page.locator('') }


    /********************************************************** Actions ********************************************************* */

    async selectPropertyByIndexNumber(index: number) {
        await this.selectProperty(index).waitFor()
        await Promise.all([
            this.page.waitForNavigation(),
            this.selectProperty(index).click()
        ]);
    }

    async getPropertyInfo(room: string, type: string, index: number) {
        let info = {}
        await this.propertyPrice(index).waitFor()
        const propertyPrice = await this.propertyPrice(index).innerText()
        const propertyRooms = await this.propertyRooms(room, index).innerText()
        const propertyArea = await this.propertyArea(index).innerText()
        const propertyType = await this.propertyType(type, index).innerText()
        const propertyAddress = await this.propertyAddress(index).innerText()
        return Object.assign(info, { price: propertyPrice, rooms: propertyRooms, area: propertyArea, type: propertyType, address: propertyAddress })
    }

    async navigateBackWord() {
        await this.backButton.click()
        return this;
    }

    async clickOnShareIcon() {
        await this.shareButton.click()
        return this;
    }

    async clickOnCopyLink() {
        await this.copyLink.click()
        return this;
    }

    async clickOnCalculatorLink() {
        if(this.page.url().includes('/en/')) {return this.page.locator('text=Calculate your personal interest rate').click()}
        if(this.page.url().includes('/immobilien/')) {return this.page.locator('text=Berechnen Sie Ihren persönlichen Zinssatz').click()}
        if(this.page.url().includes('/it/')) {return this.page.locator('text=Calcoli il suo tasso di interesse personale').click()}
        if(this.page.url().includes('/fr/')) {return this.page.locator("text=Calculez votre taux d'intérêt personnel").click()}
    }

    async calculateInterestRatePage() {
        let interestRatePage
        [interestRatePage] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.clickOnCalculatorLink()
        ]);
        await interestRatePage.waitForLoadState();
        return interestRatePage
    }

    async getPropertyInfos(room: string, type: string, index: number) {
        let info = {}
        await this.propertyPrice(index).waitFor()
        const propertyPrice = await this.propertyPrice(index).innerText()
        const propertyRooms = await this.propertyRooms(room, index).innerText()
        const propertyArea = await this.propertyArea(index).innerText()
        const propertyType = await this.propertyType(type, index).innerText()
        const propertyAddress = await this.propertyAddress(index).innerText()
        return Object.assign(info, { price: propertyPrice.split("'").join(""), rooms: propertyRooms, area: propertyArea, type: propertyType, address: propertyAddress })
    }


}
