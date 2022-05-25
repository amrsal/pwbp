import { expect } from "@playwright/test";

export default class DataProvider {
    static regexMatcher(arg0: string, Regcsrftoken: RegExp, arg2: number) {
        throw new Error('Method not implemented.');
    }

    randomNo = Math.floor(10000 * Math.random() + 1).toString();

    setNewRandomNo(int: number) {
        return Math.floor(int * Math.random() + 1).toString();
    }

    getRandomString(length: number) {
        let string = '';
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // Include numbers if you want
        for (let i = 0; i < length; i++) {
            string += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return string;
    }

    checkValueRangeFromMinToMaX(arr: any, min: number, max: number) { return arr.every((el: number) => el >= min && el <= max); }

    async checkArrOfNumberSorting(arr: number[]) {
        const array = arr.map((i) => Number(i));
        if (!array.length) {
            return "Just one element";
        }
        if (array.every((x, i) => i === 0 || x >= arr[i - 1])) return 'Ascending';
        if (array.every((x, i) => i === 0 || x <= arr[i - 1])) return 'Descending';
        return "Unsorted";
    }

    async checkArrOfStringSorting(arr: any) {
        const c = [];
        for (let i = 1; i < arr.length; i++) {
            c.push(arr[i - 1].localeCompare(arr[i]));
        }

        if (c.every((n) => n <= 0)) return 'Ascending';
        if (c.every((n) => n >= 0)) return 'Descending';

        return 'Unsorted';
    }

    async insertString(str: string, index: number, stringToAdd: any) {
        return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
    }

    getRandomItemFromArray(arr: []) {
        const randomValue = Math.floor(Math.random() * arr.length);
        return arr[randomValue];
    }

    regexMatcher(str: string, regexp: RegExp, group: number) {
        const array = [...str.matchAll(regexp)];
        return array.map(m => m[group]);
    }

    async expectListOfElementsToBeDisplayed(elementArray: any) {
        var list = elementArray;
        var element;
        for (element of list) {
            return expect(element).toBeVisible();

        }
    }

    async generateTodayDate() {
        const date = new Date()
        const month = date.getMonth()
        const day = date.getDate()
        const year = date.getFullYear()
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
            'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return `${monthNames[month]} ${day}, ${year}`
    }

    getTodayDate = this.generateTodayDate()

    async startDate() {
        const date = new Date()
        const month = date.getMonth()
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        const year = date.getFullYear()
        return `${year}-${month}-${day}`
    }

    startFeatureDate = this.startDate()

    convertToMio = (value: number): number => {
        const millions = value / 1.0e6;
        return +millions.toFixed(2);
    };

    convertToK = (value: number): number => {
        const thousands = value / 1.0e3;
        return +thousands.toFixed(2);
    };

    async formatPrice  (price: number) {
        switch (true) {
            case price >= 1.0e6:
                return `${this.convertToMio(price)}M`;
            case price >= 1.0e3:
                return `${this.convertToK(price)}K`;
            default:
                return price.toString();
        }
    };
}