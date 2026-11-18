
const API_URL = 'http://localhost:3000/api/siswa';

export interface Siswa {
    kode_siswa: string;
    nama_siswa: string;
    jenis_kelamin: string;
    jurusan: string;
    kelas: string;
    tanggal_lahir_siswa: string;
    alamat_siswa: string;
}

export type SiswaInput = Siswa;

export const getSiswa = async (): Promise<Siswa[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('Gagal mengambil data siswa');
    }

    const result = await response.json();
    return result.data;
};

export const createSiswa = async (
    data: SiswaInput
): Promise<Siswa> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Gagal menambahkan siswa');
    }

    return result.data;
};

export const updateSiswa = async (
    kode_siswa: string,
    data: Omit<Siswa, 'kode_siswa'>
): Promise<Siswa> => {
    const response = await fetch(
        `${API_URL}/${encodeURIComponent(kode_siswa)}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Gagal memperbarui siswa');
    }

    return result.data;
};

export const deleteSiswa = async (
    kode_siswa: string
): Promise<void> => {
    const response = await fetch(
        `${API_URL}/${encodeURIComponent(kode_siswa)}`,
        { method: 'DELETE' }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Gagal menghapus siswa');
    }
};
