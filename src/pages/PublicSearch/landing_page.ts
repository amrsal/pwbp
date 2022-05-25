import { Page } from "playwright-core";

export default class LandingPage {

    private page: Page

    constructor(page: Page) {
        this.page = page;
    }

    /********************************************************** Elements ********************************************************* */

    textElement(text: string) { return this.page.locator(`text=${text} >> nth=0`) }
    get searchInput() { return this.page.locator('input[placeholder] >> nth=0') }
    get langSwitcher() { return this.page.locator(`button[role="menuitem"]`) }
    langSwitcherList(lang: string) { return this.page.locator(`a[title="${lang}"]:has-text("${lang}") >> nth=0`) }


    /********************************************************** Actions ********************************************************* */

    async waitForText(text: string){
        await this.textElement(text).waitFor()
        return this;
    }
    
    async searchForCity(value: any) {
        await this.searchInput.waitFor()
        await this.searchInput.fill('')
        await this.searchInput.type(value, { delay: 50 })
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

    async open(url: string) {
        await this.page.goto(url, { waitUntil: "networkidle" })
        return this;
    }

}
