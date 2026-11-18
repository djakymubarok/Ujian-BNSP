
import type {
    Siswa,
    CreateSiswaInput,
    UpdateSiswaInput
} from './siswa.model.js';

export interface SiswaRepository {
    findAll(): Promise<Siswa[]>;

    findByKode(kode_siswa: string): Promise<Siswa | null>;

    create(input: CreateSiswaInput): Promise<Siswa>;

    update(
        kode_siswa: string,
        input: UpdateSiswaInput
    ): Promise<Siswa | null>;

    delete(kode_siswa: string): Promise<boolean>;
}
