import { Page } from "playwright-core";
import { configList } from "./exporter";

export default class DashLoginPage {

    private page: Page

    constructor(page: Page) {
        this.page = page;
    }

    //-------------------------------- Elements--------------------------------//
    get username() { return this.page.locator('#dibLoginUsername') }
    get password() { return this.page.locator('#dibLoginPassword') }
    get loginButton() { return this.page.locator('#dibLoginBtn') }
    get errorHolder() { return this.page.locator('//div[@class="dib-alerts__text"]') }
    get langSwitcher() { return this.page.locator('#language-switch') }
    get langMenu() { return this.page.locator('div[role="tooltip"]') }
    get PHLogo() {return this.page.locator('img[alt="PH Logo"]')}



    //-------------------------------- Actions--------------------------------//

    // await page.locator('button:has-text("en")').click();
    // // Click text=Deutsch
    // await page.locator('text=Deutsch').click();
    // await expect(page).toHaveURL('https://dash.pricehubble.com/login?language=de_CH');

    async LoginWith(username: string, password: string) {
        await this.username.waitFor()
        await this.username.type(username)
        await this.password.type(password)
        await this.loginButton.click()
    }

    async waitForResponseAndVerifyStatus(username: string, password: string, expectedStatus: number) {
        await Promise.all([
            this.page.waitForResponse(response =>
                response.url() === `${configList.APIBaseUrl}/auth/login/credentials` &&
                response.status() === expectedStatus,
                { timeout: 4000 }),
            this.LoginWith(username, password)
        ]);
    }

    async switchLanguageTo(lang: string) {
        await this.langSwitcher.waitFor()
        await this.langSwitcher.click()
        await this.langMenu.waitFor()
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.locator(`text=${lang}`).click()
        ]);
        await this.PHLogo.waitFor()
    }

}
