
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'db_siswa',
});

export const testDatabaseConnection = async (): Promise<void> => {
    try {
        const result = await pool.query('SELECT NOW()');

        console.log('Database PostgreSQL berhasil terhubung!');
        console.log('Waktu database:', result.rows[0].now);
    } catch (error) {
        console.error('Koneksi database gagal:', error);
        process.exit(1);
    }
};
