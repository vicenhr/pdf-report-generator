export function ratingToNumber(text) {
    const numbers = {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5
    };
    return numbers[text.toLowerCase()];
}