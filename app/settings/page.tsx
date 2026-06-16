'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  User, Phone, MapPin, FileText, Globe, Save,
  Loader2, LogOut, Camera, ShieldCheck, Bell,
} from 'lucide-react';
import toast from 'react-hot-toast';

const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্' },
  { code: 'bo', name: 'Bodo', native: 'बड़ो' },
];

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '', phone: '', city: '', bio: '', image: '', language: 'en',
  });
  const [notifications, setNotifications] = useState({
    emailBooking: true, emailEvents: true, emailMarketing: false,
  });
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/profile')
        .then(r => r.json())
        .then(data => {
          setProfile({
            name: data.name || '',
            phone: data.phone || '',
            city: data.city || '',
            bio: data.bio || '',
            image: data.image || '',
            language: data.language || 'en',
          });
        })
        .catch(() => {});
    }
  }, [session]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-400" size={32} /></div>;
  }

  if (!session) {
    router.push('/login?callbackUrl=/settings');
    return null;
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error('Failed to save');
      await update({ name: profile.name, language: profile.language });
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  async function saveLanguage() {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: profile.language }),
      });
      if (!res.ok) throw new Error('Failed to save');
      await update({ language: profile.language });
      const lang = INDIAN_LANGUAGES.find(l => l.code === profile.language);
      toast.success(`Language set to ${lang?.name}!`);
    } catch {
      toast.error('Failed to save language');
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (passwords.newPw !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPw.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Password changed successfully!');
      setPasswords({ current: '', newPw: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500";

  const selectedLang = INDIAN_LANGUAGES.find(l => l.code === profile.language);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-1">Settings</h1>
        <p className="text-gray-400">Manage your account, profile and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="glass rounded-2xl p-4 space-y-1">
            {/* Avatar */}
            <div className="flex flex-col items-center py-4 mb-2 border-b border-white/5">
              <div className="relative mb-3">
                {profile.image ? (
                  <img src={profile.image} alt="Avatar" className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-500" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-600/30 flex items-center justify-center ring-2 ring-primary-500">
                    <span className="text-2xl font-bold text-primary-300">
                      {(session.user?.name || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="absolute bottom-0 right-0 bg-primary-600 p-1 rounded-full">
                  <Camera size={10} className="text-white" />
                </span>
              </div>
              <p className="text-sm font-semibold text-white truncate max-w-full">{session.user?.name}</p>
              <p className="text-xs text-gray-400 truncate max-w-full">{session.user?.email}</p>
            </div>

            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}

            <div className="pt-2 border-t border-white/5">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 glass rounded-2xl p-6 md:p-8">

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-xl">Your Profile</h2>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300"><User size={14} /> Full Name</label>
                <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Your full name" className={inputClass} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300"><Phone size={14} /> Phone Number</label>
                <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 98765 43210" className={inputClass} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300"><MapPin size={14} /> City</label>
                <input value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })} placeholder="e.g. Mumbai, Chennai, Delhi" className={inputClass} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300"><FileText size={14} /> Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us a little about yourself..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300"><Camera size={14} /> Profile Photo URL</label>
                <input value={profile.image} onChange={e => setProfile({ ...profile, image: e.target.value })} placeholder="https://..." className={inputClass} />
                {profile.image && (
                  <img src={profile.image} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover ring-2 ring-primary-500" />
                )}
              </div>

              <button onClick={saveProfile} disabled={saving} className="btn-primary text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Profile
              </button>
            </div>
          )}

          {/* LANGUAGE TAB */}
          {activeTab === 'language' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-semibold text-xl mb-1">Language Preference</h2>
                <p className="text-gray-400 text-sm">Choose your preferred language for the LUMEN interface.</p>
              </div>

              {/* Current */}
              <div className="glass rounded-xl p-4 flex items-center gap-4 border border-primary-500/30">
                <Globe className="text-primary-400 shrink-0" size={22} />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Currently selected</p>
                  <p className="font-semibold text-white">{selectedLang?.name}
                    <span className="ml-2 text-gray-400 font-normal">{selectedLang?.native}</span>
                  </p>
                </div>
              </div>

              {/* Language grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INDIAN_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setProfile({ ...profile, language: lang.code })}
                    className={`p-3 rounded-xl text-left transition border ${
                      profile.language === lang.code
                        ? 'border-primary-500 bg-primary-600/20 text-white'
                        : 'border-white/5 bg-dark-700/50 text-gray-300 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <p className="text-sm font-semibold">{lang.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{lang.native}</p>
                  </button>
                ))}
              </div>

              <button onClick={saveLanguage} disabled={saving} className="btn-primary text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Language
              </button>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-semibold text-xl mb-1">Notification Preferences</h2>
                <p className="text-gray-400 text-sm">Manage how and when LUMEN contacts you.</p>
              </div>

              {[
                { key: 'emailBooking', label: 'Booking Confirmations', desc: 'Get emailed when a booking is confirmed or cancelled' },
                { key: 'emailEvents', label: 'New Events Near You', desc: 'Weekly digest of new events in your city' },
                { key: 'emailMarketing', label: 'Offers & Promotions', desc: 'Special deals and discount codes from LUMEN' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between gap-4 py-4 border-b border-white/5">
                  <div>
                    <p className="font-medium text-white text-sm">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                      notifications[key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-dark-600'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                      notifications[key as keyof typeof notifications] ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}

              <button
                onClick={() => toast.success('Notification preferences saved!')}
                className="btn-primary text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2"
              >
                <Save size={16} /> Save Preferences
              </button>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-semibold text-xl mb-1">Security</h2>
                <p className="text-gray-400 text-sm">Update your password to keep your account secure.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Current Password</label>
                <input type="password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} placeholder="••••••••" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">New Password</label>
                <input type="password" value={passwords.newPw} onChange={e => setPasswords({ ...passwords, newPw: e.target.value })} placeholder="Min. 6 characters" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Confirm New Password</label>
                <input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="Repeat new password" className={inputClass} />
              </div>

              <button onClick={changePassword} disabled={saving} className="btn-primary text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                Change Password
              </button>

              <div className="border-t border-white/5 pt-6">
                <h3 className="font-semibold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-400 mb-4">Once you delete your account, there is no going back.</p>
                <button className="border border-red-500/40 text-red-400 hover:bg-red-500/10 font-semibold px-6 py-2.5 rounded-full text-sm transition">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
