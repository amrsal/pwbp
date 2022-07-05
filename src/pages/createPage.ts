import { Page } from "playwright-core";

export default class CreatePage {

    private page: Page

    constructor(page: Page) {
        this.page = page;
    }

    //-------------------------------- Elements--------------------------------//
    get newDossierHeader() { return this.page.locator('text=New dossier') }
    get titleInput() { return this.page.locator('#title') }
    get addressInput() { return this.page.locator('[placeholder="Enter your address"]') }
    get propertyType() { return this.page.locator('label:has-text("House") >> nth=1') }
    elementText(text: string) { return this.page.locator(`text=${text}`) }
    // get x() { return this.page.locator('') }
    // get x() { return this.page.locator('') }
    // get x() { return this.page.locator('') }



    //-------------------------------- Actions--------------------------------//

    async waitForPageToBeLoaded() {
        await this.newDossierHeader.waitFor({ state: "visible" })
    }

    async fillTheDossierTitle(title: string) {
        await this.titleInput.type(title)
    }

    async fillTheAddressInput(address: string) {
        await this.addressInput.type(address)
    }
}
