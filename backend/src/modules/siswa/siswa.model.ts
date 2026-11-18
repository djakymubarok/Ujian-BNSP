
export interface Siswa {
    kode_siswa: string;
    nama_siswa: string;
    jenis_kelamin: string;
    jurusan: string;
    kelas: string;
    tanggal_lahir_siswa: string;
    alamat_siswa: string;
}

export type CreateSiswaInput = Siswa;

export type UpdateSiswaInput = Omit<Siswa, 'kode_siswa'>;
