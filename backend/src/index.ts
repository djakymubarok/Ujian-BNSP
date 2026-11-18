import express from 'express';
import cors from 'cors';

import { testDatabaseConnection } from './config/database.js';
import siswaRoute from './modules/siswa/siswa.route.js';

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'API CRUD SISWA berhasil berjalan!'
    });
});

app.use('/api/siswa', siswaRoute);

const startServer = async (): Promise<void> => {
    await testDatabaseConnection();

    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
};

startServer();