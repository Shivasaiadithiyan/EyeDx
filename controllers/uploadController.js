import pool from '../db.js';


export const uploadScan = async (req, res) => {
    const {
      imgurl,
      doclogkey,
      patlogkey,
      classification,
      diagnosis,
      prescription,
      status
    } = req.body;
  
    try {
      const result = await pool.query(
        `INSERT INTO scans (imgurl, doclogkey, patlogkey, classification, diagnosis, prescription, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
        [imgurl, doclogkey, patlogkey, classification, diagnosis, prescription, status]
      );
  
      res.status(201).json({ message: 'Scan uploaded successfully', scan: result.rows[0] });
    } catch (error) {
      console.error(' Error inserting scan:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  export const updateQuickScanClassification = async (req, res) => {
    const { id } = req.params;
    const { classification } = req.body;
  
    if (!classification) {
      return res.status(400).json({ error: 'Classification is required' });
    }
  
    try {
      const result = await pool.query(
        `UPDATE quickscan SET classification = $1 WHERE id = $2 RETURNING *`,
        [classification, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'QuickScan not found' });
      }
  
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Error updating quickscan:', err);
      res.status(500).json({ error: 'Failed to update classification' });
    }
  };


  export const getUnclassifiedQuickScans = async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, imgurl FROM quickscan WHERE classification IS NULL`
      );
      res.json({ success: true, scans: result.rows });
    } catch (err) {
      console.error('Error fetching unclassified quickscans:', err);
      res.status(500).json({ error: 'Failed to fetch quickscans' });
    }
  };