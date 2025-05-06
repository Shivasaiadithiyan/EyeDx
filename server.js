import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', scanRoutes);
app.use('/api', uploadRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

