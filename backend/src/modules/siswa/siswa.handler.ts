
import type { RequestHandler } from 'express';

import { SiswaRepositoryPg } from './siswa.repository.pg.js';

import type {
    CreateSiswaInput,
    UpdateSiswaInput
} from './siswa.model.js';

const siswaRepository = new SiswaRepositoryPg();

const isValid = (
    input: Record<string, unknown>,
    fields: string[]
): boolean => {
    return fields.every(
        (field) =>
            typeof input[field] === 'string' &&
            (input[field] as string).trim().length > 0
    );
};

const createFields = [
    'kode_siswa',
    'nama_siswa',
    'jenis_kelamin',
    'jurusan',
    'kelas',
    'tanggal_lahir_siswa',
    'alamat_siswa'
];

const updateFields = [
    'nama_siswa',
    'jenis_kelamin',
    'jurusan',
    'kelas',
    'tanggal_lahir_siswa',
    'alamat_siswa'
];

// GET ALL SISWA
export const getAllSiswa: RequestHandler = async (_req, res) => {
    const data = await siswaRepository.findAll();

    res.status(200).json({
        success: true,
        message: 'Berhasil mengambil data siswa',
        data
    });
};

// GET SISWA BY KODE
export const getSiswaByKode: RequestHandler<{ kode_siswa: string }> =
    async (req, res) => {
        const data = await siswaRepository.findByKode(
            req.params.kode_siswa
        );

        if (!data) {
            res.status(404).json({
                success: false,
                message: 'Data siswa tidak ditemukan'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Data siswa ditemukan',
            data
        });
    };

// CREATE SISWA
export const createSiswa: RequestHandler = async (req, res) => {
    const body = req.body as Record<string, unknown>;

    if (!isValid(body, createFields)) {
        res.status(400).json({
            success: false,
            message: 'Semua data siswa wajib diisi'
        });
        return;
    }

    const data = await siswaRepository.create(
        body as unknown as CreateSiswaInput
    );

    res.status(201).json({
        success: true,
        message: 'Data siswa berhasil ditambahkan',
        data
    });
};

// UPDATE SISWA
export const updateSiswa: RequestHandler<{ kode_siswa: string }> =
    async (req, res) => {
        const body = req.body as Record<string, unknown>;

        if (!isValid(body, updateFields)) {
            res.status(400).json({
                success: false,
                message: 'Semua data siswa wajib diisi'
            });
            return;
        }

        const data = await siswaRepository.update(
            req.params.kode_siswa,
            body as unknown as UpdateSiswaInput
        );

        if (!data) {
            res.status(404).json({
                success: false,
                message: 'Data siswa tidak ditemukan'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Data siswa berhasil diperbarui',
            data
        });
    };

// DELETE SISWA
export const deleteSiswa: RequestHandler<{ kode_siswa: string }> =
    async (req, res) => {
        const deleted = await siswaRepository.delete(
            req.params.kode_siswa
        );

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Data siswa tidak ditemukan'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Data siswa berhasil dihapus'
        });
    };
