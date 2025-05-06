import pool from '../db.js';

// Get all patients assigned to a doctor
export const getDoctorPatients = async (req, res) => {
  const doctorKey = req.user.loginKey;

  try {
    const result = await pool.query(
      'SELECT DISTINCT p.* FROM patients p JOIN scans s ON p.login_key = s.patlogkey WHERE s.doclogkey = $1',
      [doctorKey]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

// Get all scans for a patient (doctor-specific)
export const getPatientScans = async (req, res) => {
  const doctorKey = req.user.loginKey;
  const { patientKey } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM scans WHERE doclogkey = $1 AND patlogkey = $2 ORDER BY created_at DESC',
      [doctorKey, patientKey]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching scans' });
  }
};

// Get single scan detail
export const getScanDetail = async (req, res) => {
  const { scanId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM scans WHERE id = $1', [scanId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Scan not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching scan details' });
  }
};

// Update diagnosis/prescription/status for a scan
export const updateScan = async (req, res) => {
  const { scanId } = req.params;
  const { diagnosis, prescription, status } = req.body;

  try {
    await pool.query(
      'UPDATE scans SET diagnosis = $1, prescription = $2, status = $3 WHERE id = $4',
      [diagnosis, prescription, status || 'completed', scanId]
    );

    res.status(200).json({ message: 'Scan updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update scan' });
  }
};


