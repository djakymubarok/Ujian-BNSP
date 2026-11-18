
import { pool } from '../../config/database.js';

import type {
    Siswa,
    CreateSiswaInput,
    UpdateSiswaInput
} from './siswa.model.js';

import type { SiswaRepository } from './siswa.repository.js';

export class SiswaRepositoryPg implements SiswaRepository {

    async findAll(): Promise<Siswa[]> {
        const result = await pool.query(
            'SELECT * FROM siswa ORDER BY nama_siswa ASC'
        );

        return result.rows;
    }

    async findByKode(kode_siswa: string): Promise<Siswa | null> {
        const result = await pool.query(
            'SELECT * FROM siswa WHERE kode_siswa = $1',
            [kode_siswa]
        );

        return result.rows[0] ?? null;
    }

    async create(input: CreateSiswaInput): Promise<Siswa> {
        const query = `
            INSERT INTO siswa (
                kode_siswa,
                nama_siswa,
                jenis_kelamin,
                jurusan,
                kelas,
                tanggal_lahir_siswa,
                alamat_siswa
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

        const values = [
            input.kode_siswa,
            input.nama_siswa,
            input.jenis_kelamin,
            input.jurusan,
            input.kelas,
            input.tanggal_lahir_siswa,
            input.alamat_siswa
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    }

    async update(
        kode_siswa: string,
        input: UpdateSiswaInput
    ): Promise<Siswa | null> {
        const query = `
            UPDATE siswa
            SET
                nama_siswa = $1,
                jenis_kelamin = $2,
                jurusan = $3,
                kelas = $4,
                tanggal_lahir_siswa = $5,
                alamat_siswa = $6
            WHERE kode_siswa = $7
            RETURNING *
        `;

        const values = [
            input.nama_siswa,
            input.jenis_kelamin,
            input.jurusan,
            input.kelas,
            input.tanggal_lahir_siswa,
            input.alamat_siswa,
            kode_siswa
        ];

        const result = await pool.query(query, values);

        return result.rows[0] ?? null;
    }

    async delete(kode_siswa: string): Promise<boolean> {
        const result = await pool.query(
            'DELETE FROM siswa WHERE kode_siswa = $1 RETURNING kode_siswa',
            [kode_siswa]
        );

        return (result.rowCount ?? 0) > 0;
    }
}
