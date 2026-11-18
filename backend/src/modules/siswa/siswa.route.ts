
import { Router } from 'express';

import {
    getAllSiswa,
    getSiswaByKode,
    createSiswa,
    updateSiswa,
    deleteSiswa
} from './siswa.handler.js';

const router = Router();

router.get('/', getAllSiswa);
router.get('/:kode_siswa', getSiswaByKode);
router.post('/', createSiswa);
router.patch('/:kode_siswa', updateSiswa);
router.delete('/:kode_siswa', deleteSiswa);

export default router;
