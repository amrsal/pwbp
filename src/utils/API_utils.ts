import { DataProvider as D, configList } from '../pages/exporter'
import { Page, request } from "playwright-core";
import { expect } from '@playwright/test';
import dataProvider from './data-provider';

let req,
    cookies: string,
    referer_uid: string,
    cookieArry: {}

export default class API {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get token() { return this.page.evaluate(() => { return 'Bearer ' + localStorage.accessToken }) }
    get authToken() { return Buffer.from(`${configList.credential.username}:${configList.credential.password}`, 'binary').toString('base64') }


    async getCookiesWith() {

        req = await request.newContext({
            baseURL: configList.baseURL,
            extraHTTPHeaders: {
                'Accept': 'application/json; */*',
                'Content-Type': 'application/json',
                'User-Agent': configList.userAgent,
                'Accept-Language': 'en-US,en;q=0.5',
                'Authorization': `Basic ${this.authToken}`,
            },
        })

        await req.post('/').then(res => {
            expect(res.status()).toBe(200)
            cookies = res.headers()['set-cookie']
            referer_uid = cookies.split(';')[2].split('referer_uid=')[1]
        })

        return await req.post(`en/accounts/api/v2/login/`,
            {
                headers: {
                    'Cookie': `referer_uid=${referer_uid}`,
                },
                data: {
                    "email": configList.credential.email,
                    "password": configList.credential.password
                }
            }).then(async (res) => {
                try {
                    expect(res.status()).toBe(200)
                    const Regcsrftoken = /csrftoken=(.+?);/gm;
                    const Regmpre_grant_token = /mpre_grant_token=(.+?);/gm;
                    const Regsessionid = /sessionid=(.+?);/gm;

                    const loginCookies = await res.headers()['set-cookie']
                    const csrftoken = dataProvider.regexMatcher(await loginCookies, Regcsrftoken, 1)[0]
                    const mpre_grant_token = dataProvider.regexMatcher(await loginCookies, Regmpre_grant_token, 1)[0]
                    const sessionid = dataProvider.regexMatcher(await loginCookies, Regsessionid, 1)[0]
                    const cookieArry = Object.assign({}, { 'referer_uid': referer_uid, 'csrftoken': csrftoken, 'mpre_grant_token': mpre_grant_token, 'sessionid': sessionid })
                    return cookieArry
                } catch (error) {
                    console.error(`---> Ops!! something went wrong: ${error}}`)
                }
            })
    }

    



}
