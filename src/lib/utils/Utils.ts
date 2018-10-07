export class Utils {
    /**
     * @credit: stackoverflow.com
     * @returns {boolean}
     */
    public static isBrowser(): boolean {
        return typeof window !== 'undefined' && ({}).toString.call(window) === '[object Window]';
    }
}