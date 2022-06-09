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


    //-------------------------------- Actions--------------------------------//

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
}
