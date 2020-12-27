const { checkValid } = require('../db/utils/modelUtils');

describe('checkValid', () => {
    it('returns true if an array contains a given string', () => {
        const validKeys = ['name', 'number'];
        const queryKey = 'name';
        const actual = checkValid(validKeys, queryKey);
        const expected = true;
        expect(actual).toEqual(expected);
    });
    it('returns true if the key to check is undefined', () => {
        const validKeys = ['name', 'number'];
        const queryKey = undefined;
        const actual = checkValid(validKeys, queryKey);
        const expected = true;
        expect(actual).toEqual(expected);
    });
    it('returns false if the key to check is undefined', () => {
        const validKeys = ['name', 'number'];
        const queryKey = 'nombre';
        const actual = checkValid(validKeys, queryKey);
        const expected = false;
        expect(actual).toEqual(expected);
    });
});