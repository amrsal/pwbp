import { test as base } from '@playwright/test';
import { LandingPage, PublicSearch, PropertyDetails, DataProvider, DashLoginPage, CreatePage } from './exporter';


const fixtures = base.extend<{ landingPage: LandingPage, publicSearch: PublicSearch, propertyDetails: PropertyDetails, dataProvider: DataProvider, dashLoginPage: DashLoginPage, createPage: CreatePage }>({

    landingPage: async ({ page }, use) => {
        const landingPage = new LandingPage(page)
        await use(landingPage)
    },
    publicSearch: async ({ page }, use) => {
        const publicSearch = new PublicSearch(page)
        await use(publicSearch)
    },
    propertyDetails: async ({ page }, use) => {
        const propertyDetails = new PropertyDetails(page)
        await use(propertyDetails)
    },
    dashLoginPage: async ({ page }, use) => {
        const dashLoginPage = new DashLoginPage(page)
        await use(dashLoginPage)
    },
    createPage: async ({ page }, use) => {
        const createPage = new CreatePage(page)
        await use(createPage)
    },
    dataProvider: async ({ }, use) => {
        const dataProvider = new DataProvider()
        await use(dataProvider)
    }

});

export { fixtures };