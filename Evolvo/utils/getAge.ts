export function getDaysAgo(date:Date) {

    const inputDate = new Date(date);

    const ms = Date.now() - inputDate.getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
}

