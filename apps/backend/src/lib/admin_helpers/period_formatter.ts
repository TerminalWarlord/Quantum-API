import { RevenuePeriod } from "@repo/types";

export function formatTimeseriesData(
    period: Date,
    periodType: RevenuePeriod
) {
    switch (periodType) {
        case RevenuePeriod.YEAR:
            return period.getUTCFullYear().toString();
        case RevenuePeriod.MONTH:
            return period.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                timeZone: "UTC"
            });
        case RevenuePeriod.DAY:
            return period.toISOString().slice(0, 10);
        case RevenuePeriod.HOUR:
            return period.getUTCHours().toString();
        default:
            return period.toISOString();
    }
}

