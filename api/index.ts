import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

let accessPassword = process.env.ACCESS_PASSWORD || 'guru2026';
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// API: Verify Gate Password
app.post('/api/access-gate/verify', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Kata sandi wajib diisi.' });
  }
  if (password === accessPassword) {
    return res.json({ success: true, message: 'Akses berhasil diberikan.' });
  }
  return res.status(401).json({ success: false, message: 'Kata sandi akses tidak valid. Silakan coba lagi.' });
});

// API: Update Gate Password
app.post('/api/access-gate/update', (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ success: false, message: 'Kata sandi baru minimal 4 karakter.' });
  }
  if (currentPassword !== accessPassword) {
    return res.status(401).json({ success: false, message: 'Kata sandi lama salah.' });
  }
  accessPassword = newPassword;
  return res.json({ success: true, message: 'Kata sandi akses EDU PLAN AI berhasil diperbarui!' });
});

// API: Send OTP
app.post('/api/auth/send-otp', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Alamat email tidak valid.' });
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  return res.json({
    success: true,
    message: `Kode verifikasi OTP telah dikirimkan ke ${email}.`,
    simulatedOtp: code,
  });
});

// API: Verify OTP
app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email dan OTP diperlukan.' });
  }
  const record = otpStore.get(email.toLowerCase());
  if (!record) {
    return res.status(400).json({ success: false, message: 'Kode OTP tidak ditemukan atau telah kedaluwarsa.' });
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ success: false, message: 'Kode OTP telah kedaluwarsa.' });
  }
  if (record.code !== otp.trim()) {
    return res.status(400).json({ success: false, message: 'Kode OTP salah. Periksa kembali angka 6 digit Anda.' });
  }

  otpStore.delete(email.toLowerCase());
  return res.json({ success: true, message: 'Verifikasi email berhasil!' });
});

// API: Gemini Generation
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt tidak boleh kosong.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY belum dikonfigurasi di Environment Variables Vercel.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'Anda adalah asisten AI pendidikan Sekolah Dasar Kurikulum Merdeka di Indonesia.',
        temperature: 0.7,
      },
    });

    return res.json({
      success: true,
      text: response.text,
    });
  } catch (error: any) {
    console.error('Gemini error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat memproses permintaan AI.',
    });
  }
});

export default app;
