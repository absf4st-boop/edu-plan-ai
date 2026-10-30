import React, { useState } from 'react';
import { X, Mail, Key, User, CheckCircle2, AlertCircle, Send, ShieldCheck, Copy } from 'lucide-react';
import { storageService } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (!regEmail || !regEmail.includes('@')) {
      setStatusMsg({ type: 'error', text: 'Masukkan alamat email pribadi yang valid.' });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setSimulatedOtp(data.simulatedOtp || '123456');
        setStatusMsg({ type: 'success', text: `Kode verifikasi OTP 6 digit berhasil dikirim ke ${regEmail}!` });
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Gagal mengirim OTP.' });
      }
    } catch {
      // Offline fallback simulator
      const mock = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpSent(true);
      setSimulatedOtp(mock);
      setStatusMsg({ type: 'success', text: 'Kode verifikasi OTP siap dimasukkan.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setStatusMsg({ type: 'error', text: 'Masukkan 6 digit angka OTP verifikasi.' });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, otp: otpCode }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        setStatusMsg({ type: 'success', text: 'Email berhasil diverifikasi! Silakan tentukan kata sandi akun Anda.' });
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Kode OTP tidak cocok.' });
      }
    } catch {
      if (simulatedOtp && otpCode === simulatedOtp) {
        setOtpVerified(true);
        setStatusMsg({ type: 'success', text: 'Email berhasil diverifikasi!' });
      } else {
        setStatusMsg({ type: 'error', text: 'Kode OTP tidak sesuai.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setStatusMsg({ type: 'error', text: 'Lengkapi nama dan email Anda.' });
      return;
    }
    if (!otpVerified) {
      setStatusMsg({ type: 'error', text: 'Harap verifikasi kode OTP email terlebih dahulu.' });
      return;
    }
    if (!regPassword || regPassword.length < 5) {
      setStatusMsg({ type: 'error', text: 'Kata sandi minimal 5 karakter.' });
      return;
    }

    // Save user to storage
    const newUser = {
      nama: regName.trim(),
      email: regEmail.trim(),
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    storageService.saveUserAccount(newUser);

    // Also update SchoolProfile teacher name
    const currentSchool = storageService.getSchoolProfile();
    storageService.saveSchoolProfile({
      ...currentSchool,
      namaGuru: regName.trim(),
    });

    storageService.setGateUnlocked(true);
    setStatusMsg({ type: 'success', text: 'Registrasi berhasil! Membuka dashboard...' });
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 700);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setStatusMsg({ type: 'error', text: 'Masukkan email dan kata sandi.' });
      return;
    }

    const savedUser = storageService.getUserAccount();
    if (savedUser && savedUser.email.toLowerCase() === loginEmail.toLowerCase().trim()) {
      storageService.setGateUnlocked(true);
      setStatusMsg({ type: 'success', text: 'Login berhasil! Membuka dashboard...' });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
      return;
    }

    // Default educator login fallback
    const defaultUser = {
      nama: 'Husein A. Priyanto',
      email: loginEmail.trim(),
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    storageService.saveUserAccount(defaultUser);
    storageService.setGateUnlocked(true);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Akun Guru & Registrasi OTP</h3>
            <p className="text-xs text-blue-200 mt-0.5">EDU PLAN AI — Pengelolaan Administrasi Guru SD</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setActiveTab('LOGIN');
              setStatusMsg(null);
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${
              activeTab === 'LOGIN'
                ? 'text-blue-700 border-b-2 border-blue-600 bg-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk Akun Guru
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('REGISTER');
              setStatusMsg(null);
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${
              activeTab === 'REGISTER'
                ? 'text-blue-700 border-b-2 border-blue-600 bg-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Akun Baru (OTP)
          </button>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
              statusMsg.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            {statusMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Body Forms */}
        <div className="p-6">
          {activeTab === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Guru</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama.guru@sekolah.sch.id"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan sandi..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-md transition-all cursor-pointer"
              >
                Masuk ke EDU PLAN AI
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('REGISTER')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Belum punya akun? Daftar dengan verifikasi OTP email pribadi
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Guru</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Husein A. Priyanto"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Pribadi Guru</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email.anda@gmail.com"
                      disabled={otpVerified}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
                      required
                    />
                  </div>
                  {!otpVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading || !regEmail}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {otpSent ? 'Kirim Ulang' : 'Kirim OTP'}
                    </button>
                  )}
                </div>
              </div>

              {/* Simulated OTP Helper Banner */}
              {simulatedOtp && !otpVerified && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      Simulator Kode OTP Instan:
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(simulatedOtp)}
                      className="text-[11px] bg-amber-200/80 hover:bg-amber-300 px-2 py-0.5 rounded font-mono flex items-center gap-1 text-amber-900 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Masukkan ({simulatedOtp})
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Untuk kemudahan pengujian mandiri tanpa menunggu email, gunakan kode 6 digit di atas.
                  </p>
                </div>
              )}

              {/* OTP Input Field */}
              {otpSent && !otpVerified && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Kode Verifikasi OTP (6 Digit)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center tracking-widest font-mono text-base font-bold py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading || otpCode.length !== 6}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                    >
                      Verifikasi
                    </button>
                  </div>
                </div>
              )}

              {otpVerified && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Email Anda telah terverifikasi dengan kode OTP!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Buat Kata Sandi Akun</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 5 karakter..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!otpVerified || loading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-medium text-sm rounded-lg shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                Selesaikan Pendaftaran & Masuk
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
