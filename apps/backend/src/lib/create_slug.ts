import { categoriesTable, db } from "@repo/db/client";
import { nanoid } from "nanoid";
import slugify from "slugify";


export const createSlug = async (name: string) => {
    let isFirstAttempt = true;
    let slug = `${slugify(name)}`;
    while (true) {
        slug = `${slugify(name, {
            lower: true,
            replacement: '-',
            strict: true,
            trim: true
        })}`;
        if (!isFirstAttempt) {
            slug += `-${nanoid(4)}`
        }
        try {
            const [row] = await db
                .insert(categoriesTable)
                .values({
                    slug,
                    name,
                })
                .returning({ id: categoriesTable.id, slug: categoriesTable.slug });
            if (!row) {
                continue;
            }
            return {
                ...row
            }
        }
        catch (err) {
            console.log(err);
        }
        isFirstAttempt = false;
    }
}