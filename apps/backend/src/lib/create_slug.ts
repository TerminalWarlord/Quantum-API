import { db } from "@repo/db/client";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import slugify from "slugify";

export enum tableEnum {
    CATEGORIES = "categories",
    APIS = "apis",
}

export const createSlug = async (name: string, table: tableEnum = tableEnum.CATEGORIES) => {
    let isFirstAttempt = true;
    const baseSlug = `${slugify(name, {
        lower: true,
        replacement: '-',
        strict: true,
        trim: true
    })}`;
    while (true) {
        const slug = isFirstAttempt ? baseSlug : `${baseSlug}-${nanoid(4)}`
        try {
            const result = await db.execute(sql`
                SELECT id 
                FROM ${sql.identifier(table)}
                WHERE slug=${slug}
                LIMIT 1;
            `)
            if (result.rowCount == 0) {
                return {
                    slug
                };
            }
        }
        catch (err) {
            console.log(err);
        }
        isFirstAttempt = false;
    }
}