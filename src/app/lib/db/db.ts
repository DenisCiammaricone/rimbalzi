import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export let connection: mysql.Connection | null = null;

export const getConnection = async () => {
    if(!connection) {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
    }
    
    return connection;
};

const poolConnection = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

//export const db = drizzle(await getConnection());
export const db = drizzle({client: poolConnection});
//export const db = drizzle( client: await getConnection());
