import 'dotenv/config'
import { sql } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { countries, countryGroups } from '@/drizzle/schema';
import countriesByDiscount from '@/data/countriesByDiscount.json';


const groupCount = await updateCountryGroups();
const countryCount = await updateCountries();

console.log(`Updated ${groupCount} country groups and ${countryCount} countries`);

async function updateCountryGroups() {
    const insertData = countriesByDiscount.map(({ name, recommendedDiscountPercentage }) => {
        return { name, recommendedDiscountPercentage };
    });

    const { rowCount } = await db
        .insert(countryGroups)
        .values(insertData)
        .onConflictDoUpdate({
            target: countryGroups.name,
            set: {
                recommendedDiscountPercentage: sql.raw(`excluded.${countryGroups.recommendedDiscountPercentage.name}`)
            }
        });

    return rowCount;
}

async function updateCountries() {
    const groups = await db.query.countryGroups.findMany({
        columns: { id: true, name: true }
    });

    const insertData = countriesByDiscount.flatMap(({ countries, name }) => {
        const countryGroup = groups.find(group => group.name === name);
        if (!countryGroup) {
            throw new Error(`Country group ${name} not found`);
        }
        return countries.map(country => {
            return {
                name: country.countryName,
                code: country.country,
                countryGroupId: countryGroup.id
            };
        });
    });

    const { rowCount } = await db
        .insert(countries)
        .values(insertData)
        .onConflictDoUpdate({
            target: countries.code,
            set: {
                name: sql.raw(`excluded.${countries.name.name}`),
                countryGroupId: sql.raw(`excluded.${countries.countryGroupId.name}`),
            }
        });

    return rowCount;
}

export { };

