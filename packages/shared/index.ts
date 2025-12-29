
export function makeUsageKeys(subscription_id: number, metric: string) {
    const date = new Date();
    const YYYY = date.getUTCFullYear();
    const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
    const DD = String(date.getUTCDate()).padStart(2, "0");
    const HH = String(date.getUTCHours()).padStart(2, "0");

    return {
        hourKey: `usage:hour:${subscription_id}:${YYYY}${MM}${DD}${HH}:${metric}`,
        monthKey: `usage:month:${subscription_id}:${YYYY}${MM}${DD}:${metric}`
    }
}


export function getHourStart(date = new Date()) {
    return new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        0, //min
        0, //sec
        0, //ms
    ));
}


export function getMonthStart(date = new Date()) {
    return new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        1, //date
        0, //hrs
        0, //min
        0, //sec
        0, //ms
    ));
}