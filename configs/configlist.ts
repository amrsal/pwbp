import 'dotenv/config'

const configList = {
    userAgent: 'mpre_e2e_test_bot',
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 1024 },
    ignoreHTTPSErrors: true,
    fullyParallel: true,
    acceptDownloads: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.CIRCLE_BRANCH === 'dev' ? 'https://beta.moneypark.ch/en/properties/buy' : process.env.CIRCLE_BRANCH === 'master' ? 'https://moneypark.ch/en/properties/buy' : 'http://localhost:8080',
    APIBaseUrl: process.env.CIRCLE_BRANCH === 'dev' ? 'https://beta.moneypark.ch/mpre-search-api/pub/v1/' : process.env.CIRCLE_BRANCH === 'master' ? 'https://moneypark.ch/mpre-search-api/pub/v1/' : 'http://localhost:8080/mpre-search-api/pub/v1/',
    browser: process.env.CI ? 'x': 'chrome' ,
    testDir: '../src/specs',
    reporter: [
        ['list'],
        ['html', { open: 'never'}],
        ['../src/utils/myReporter.ts']
    ],
    workers: 3,
    timeout: 40000,
    assertionTimeout: 7000,
    actionTimeout: 0,
    retries: process.env.CI ? 2 : 0,
    specs:
    //s process.env.CI ? ['*'] :
        [
            'src/specs/PublicSearch/LandingPage.test.ts',
            // 'src/specs/PublicSearch/PublicSearchPage.test.ts',
            // 'src/specs/PublicSearch/PropertyDetailsPage.test.ts'
            // 'src/specs/Mobile/mobile.test.ts'
        ],
    devtools: true,
    credential: { username: process.env.BASIC_USERNAME, password: process.env.BASIC_PASSWORD, email: process.env.EMAIL }
};

export default configList