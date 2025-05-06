import pool from '../db.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import generateLoginKey from '../utils/generateLoginKey.js';
import generateToken from '../utils/generateToken.js';

export const signupDoctor = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM doctors WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const loginKey = generateLoginKey();

    await pool.query(
      'INSERT INTO doctors (name, email, password, login_key) VALUES ($1, $2, $3, $4)',
      [name, email, hashedPassword, loginKey]
    );

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
      text: `Your Login Key: ${loginKey}`
    });

    res.status(201).json({ message: 'Doctor registered. Login key sent via email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};


export const loginDoctor = async (req, res) => {
    const { loginKey, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM doctors WHERE login_key = $1', [loginKey]);
  
      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid LoginKey or Password' });
      }
  
      const doctor = result.rows[0];
      const isMatch = await bcrypt.compare(password, doctor.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid LoginKey or Password' });
      }
  
      res.status(200).json({
        message: 'Login successful',
        doctor: {
          loginKey: doctor.login_key,
          email: doctor.email,
          name: doctor.name
        },
        token: generateToken({ loginKey: doctor.login_key, role: 'doctor' })
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during login' });
    }
  };
  