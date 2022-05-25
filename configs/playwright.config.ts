import { PlaywrightTestConfig } from "@playwright/test";
import configList from "./configlist"

const project = () => {
    switch (configList.browser) {
        case 'chrome':
            return [{ name: 'Chrome', use: { browserName: 'chromium', } }];
        case 'edge':
            return [{ name: 'Edge', use: { channel: 'msedge' } }];
        case 'firefox':
            return [{ name: 'Firefox', use: { browserName: 'firefox' } }];
        case 'safari':
            return [{ name: 'Safari', use: { browserName: 'webkit', viewport: { width: 1280, height: 720 } } }];
        case 'x':
            return [{ name: 'Chrome', use: { browserName: 'chromium' } }, { name: 'Safari', use: { browserName: 'webkit', viewport: { width: 1280, height: 720 } } }, { name: 'Firefox', use: { browserName: 'firefox' } }];
        default:
            throw new Error("No valid parameter has been set for browser!");
    }
}

const config: PlaywrightTestConfig = {
    // globalTeardown: require.resolve('../src/utils/teardown.ts'),
    workers: configList.workers,
    use: {
        // actionTimeout: configList.actionTimeout,
        // ignoreDefaultArgs: ['--hide-scrollbars'],
        trace: 'retain-on-failure',
        headless: configList.headless,
        viewport: configList.viewport,
        ignoreHTTPSErrors: configList.ignoreHTTPSErrors,
        acceptDownloads: configList.acceptDownloads,
        // screenshot: configList.screenshot,
        screenshot: 'only-on-failure',
        video: configList.video,
        baseURL: configList.baseURL,
        httpCredentials: {
            username: configList.credential.username,
            password: configList.credential.password,
        },
        contextOptions: {
            userAgent: configList.userAgent,
            // permissions: ['clipboard-read', 'clipboard-write']
        },
    },
    projects: project(),
    baseURL: configList.baseURL,
    expect: { timeout: configList.assertionTimeout },
    testDir: configList.testDir,
    reporter: configList.reporter,
    timeout: configList.timeout,
    retries: configList.retries,
    fullyParallel: configList.fullyParallel,
    testMatch: configList.specs,
    devtools: configList.devtools
}

export default config;