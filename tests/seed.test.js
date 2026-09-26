import { ratingToNumber } from '../src/utils/ratingToNumber.js';
describe("ratingToNumber Tests", () => {
    test("Manda la palabra three", () => {
        expect(ratingToNumber("three")).toBe(3);
    });

    test("Manda la palabra THREE con todas las letras mayusculas", () => {
        expect(ratingToNumber("THREE")).toBe(3);
    });

    test("Manda la palabra six", () => {
        expect(ratingToNumber("six")).toBeUndefined();
    });
});