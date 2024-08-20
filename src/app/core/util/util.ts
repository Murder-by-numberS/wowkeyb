export const formatString = (input: string) => {
    return input
        .trim()
        .toLowerCase()
        .replace(/'/g, '-')   // Remove apostrophes
        .replace(/\s+/g, '-'); // Replace spaces with dashes
}
