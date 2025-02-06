export function randomInt(lower: number, upper: number) {
    const difference = (upper + 1) - lower;
    const random = Math.random() * difference;
    return Math.ceil(random + lower) - 1;
}
