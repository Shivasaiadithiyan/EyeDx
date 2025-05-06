import pool from '../db.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import generateLoginKey from '../utils/generateLoginKey.js';
import generateToken from '../utils/generateToken.js';

// Patient Signup
export const signupPatient = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM patients WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const loginKey = generateLoginKey();

    await pool.query(
      'INSERT INTO patients (name, email, password, login_key) VALUES ($1, $2, $3, $4)',
      [name, email, hashedPassword, loginKey]
    );

    // Send Login Key via Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"OCT System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OCT Login Key',
      text: `Your Patient Login Key: ${loginKey}`
    });

    res.status(201).json({ message: 'Patient registered. Login key sent via email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// Patient Login
export const loginPatient = async (req, res) => {
  const { loginKey, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM patients WHERE login_key = $1', [loginKey]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid LoginKey or Password' });
    }

    const patient = result.rows[0];
    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid LoginKey or Password' });
    }

    res.status(200).json({
      message: 'Login successful',
      patient: {
        loginKey: patient.login_key,
        email: patient.email,
        name: patient.name
      },
      token: generateToken({ loginKey: patient.login_key, role: 'patient' })
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get all scans for the logged-in patient
export const getPatientScans = async (req, res) => {
  const loginKey = req.user.loginKey;

  try {
    const result = await pool.query(
      'SELECT * FROM scans WHERE patlogkey = $1 ORDER BY created_at DESC',
      [loginKey]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching patient scans:', err);
    res.status(500).json({ message: 'Failed to fetch scans' });
  }
};

// Get a single scan by ID (for the logged-in patient)
export const getPatientScanById = async (req, res) => {
  const loginKey = req.user.loginKey;
  const scanId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT * FROM scans WHERE id = $1 AND patlogkey = $2',
      [scanId, loginKey]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Scan not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching scan by ID:', err);
    res.status(500).json({ message: 'Failed to fetch scan details' });
  }
};


export const createQuickScan = async (req, res) => {
  const { imgurl } = req.body;
  const patlogkey = req.user.loginKey; // extracted from token

  if (!imgurl) {
    return res.status(400).json({ error: 'imgurl is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO quickscan (patlogkey, imgurl) VALUES ($1, $2) RETURNING *`,
      [patlogkey, imgurl]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error inserting quickscan:', err);
    res.status(500).json({ error: 'Database insert failed' });
  }
};


export const getQuickscans = async (req, res) => {
  const { loginKey } = req.user;  // Get loginKey from the authenticated user's JWT token

  try {
    // Query to fetch all classified quickscans for the patient
    const result = await pool.query(
      'SELECT * FROM quickscan WHERE patlogkey = $1 ',
      [loginKey]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No classified quickscans found for this patient' });
    }

    res.status(200).json({
      message: 'Classified quickscans fetched successfully',
      quickscans: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching quickscans' });
  }
};

export const getQuickscanById = async (req, res) => {
  const { loginKey } = req.user;  // Extract loginKey from JWT token
  const quickscanId = req.params.id;  // Get quickscan ID from request params

  try {
    // Query to fetch the quickscan by ID and ensure it belongs to the logged-in patient
    const result = await pool.query(
      'SELECT * FROM quickscan WHERE id = $1 AND patlogkey = $2',
      [quickscanId, loginKey]
    );

    // If no result is found, return a 404 error
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Quickscan not found or does not belong to this patient' });
    }

    // Return the found quickscan details
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching quickscan by ID:', err);
    res.status(500).json({ message: 'Server error while fetching quickscan details' });
  }
};