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
    baseURL: 'https://dash.pricehubble.com/',
    // baseURL: process.env.CIRCLE_BRANCH === 'dev' ? 'https://dash.pricehubble.com/' : process.env.CIRCLE_BRANCH === 'master' ? 'https://moneypark.ch/en/properties/buy' : 'http://localhost:8080',
    APIBaseUrl: 'https://api.pricehubble.com',
    browser: process.env.CI ? 'x': 'chrome' ,
    testDir: '../src/specs',
    reporter: [
        ['list'],
        ['html', { open: 'never'}],
        ['../src/utils/myReporter.ts']
    ],
    mailReporter: {
        auth: { token: process.env.EMAIL_TOKEN, domain: process.env.EMAIL_DOMAIN },
        email: process.env.EMAIL_REPORTER,
        email_list: process.env.EMAIL_LIST,
    },
    project_name: 'write project name',
    project_logo: 'https://storage.googleapis.com/pricehubble-production-homepage-static/img/favicon-180x180.937a8dc939bb.png',
    team_name: 'PH Team',
    workers: 3,
    timeout: 40000,
    assertionTimeout: 7000,
    actionTimeout: 0,
    retries: process.env.CI ? 2 : 0,
    specs:
    //s process.env.CI ? ['*'] :
        [
            'src/specs/dashLoginPage.test.ts',
            // 'src/specs/craetePage.test.ts'
            // 'src/specs/PublicSearch/LandingPage.test.ts',
            // 'src/specs/PublicSearch/PublicSearchPage.test.ts',
            // 'src/specs/PublicSearch/PropertyDetailsPage.test.ts'
            // 'src/specs/Mobile/mobile.test.ts'
        ],
    devtools: true,
    credential: { username: process.env.BASIC_USERNAME, password: process.env.BASIC_PASSWORD, email: process.env.EMAIL }
};

export default configList