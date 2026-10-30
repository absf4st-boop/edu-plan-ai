import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// In-memory / file-based storage for access gate password & OTPs
const DATA_DIR = path.resolve(process.cwd(), '.data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
let appSettings = {
  accessPassword: process.env.ACCESS_PASSWORD || 'guru2026',
  adminPin: '123456',
};

if (fs.existsSync(SETTINGS_FILE)) {
  try {
    appSettings = { ...appSettings, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8')) };
  } catch (e) {
    console.error('Failed to parse settings file:', e);
  }
}

function saveSettings() {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// In-memory OTP storage
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// API: Verify Gate Password
app.post('/api/access-gate/verify', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Kata sandi wajib diisi.' });
  }
  if (password === appSettings.accessPassword) {
    return res.json({ success: true, message: 'Akses berhasil diberikan.' });
  }
  return res.status(401).json({ success: false, message: 'Kata sandi akses tidak valid. Silakan coba lagi.' });
});

// API: Update Gate Password (by Admin)
app.post('/api/access-gate/update', (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ success: false, message: 'Kata sandi baru minimal 4 karakter.' });
  }
  if (currentPassword !== appSettings.accessPassword && currentPassword !== appSettings.adminPin) {
    return res.status(401).json({ success: false, message: 'Kata sandi lama salah.' });
  }
  appSettings.accessPassword = newPassword;
  saveSettings();
  return res.json({ success: true, message: 'Kata sandi akses EDU PLAN AI berhasil diperbarui!' });
});

// API: Request OTP for Email Verification / Register
app.post('/api/auth/send-otp', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Alamat email tidak valid.' });
  }
  // Generate 6 digit numeric code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });

  console.log(`[AUTH OTP] Email: ${email} -> OTP Code: ${code}`);

  // Return the code in development / simulator so users can always register easily and verify immediately
  return res.json({
    success: true,
    message: `Kode verifikasi OTP telah dikirimkan ke ${email}.`,
    simulatedOtp: code, // Convenient simulator for instant verification
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
    return res.status(400).json({ success: false, message: 'Kode OTP tidak ditemukan atau telah kedaluwarsa. Mohon minta kode baru.' });
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ success: false, message: 'Kode OTP telah kedaluwarsa.' });
  }
  if (record.code !== otp.trim()) {
    return res.status(400).json({ success: false, message: 'Kode OTP salah. Periksa kembali angka 6 digit Anda.' });
  }

  // Clear OTP once used
  otpStore.delete(email.toLowerCase());
  return res.json({ success: true, message: 'Verifikasi email berhasil!' });
});

// API: Gemini AI Document Generation Proxy
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, type = 'text' } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt tidak boleh kosong.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY belum dikonfigurasi di lingkungan server. Silakan hubungkan API Key di panel Secrets.',
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
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'Anda adalah asisten pakar kurikulum Merdeka SD di Indonesia. Buat perangkat pembelajaran yang terstruktur, rapi, ramah anak, dan aplikatif.',
      },
    });

    const text = response.text || '';
    return res.json({ success: true, text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Terjadi kesalahan saat memproses permintaan AI.',
    });
  }
});

// Start server with Vite middleware in dev
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EDU PLAN AI server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
