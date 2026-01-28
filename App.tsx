
import React, { useState, useEffect } from 'react';
import { AssignmentType, Submission } from './types';
import AttendanceClock from './components/AttendanceClock';
import { getAcademicMotivation } from './services/geminiService';

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [studentName, setStudentName] = useState('');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>(AssignmentType.JURNAL);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastFeedback, setLastFeedback] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !file) {
      alert('Mohon isi nama dan lampirkan file tugas.');
      return;
    }

    setIsSubmitting(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false });
    const dateStr = now.toLocaleDateString('id-ID');

    // Simulate AI Feedback
    const feedback = await getAcademicMotivation(studentName, assignmentType, file.name);
    setLastFeedback(feedback);

    const newSubmission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      studentName,
      type: assignmentType,
      fileName: file.name,
      submissionTime: `${dateStr} ${timeStr}`,
      attendanceTime: timeStr,
      aiFeedback: feedback
    };

    setSubmissions([newSubmission, ...submissions]);
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form except name for convenience
    setFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center py-10 px-4">
      {/* Background with Higher Education Theme - Students Studying */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center transition-opacity duration-1000"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(17, 24, 39, 0.75), rgba(17, 24, 39, 0.75)), url("https://images.unsplash.com/photo-1523240693567-d7968e89b53a?auto=format&fit=crop&q=80&w=2000")',
        }}
      />

      <header className="max-w-4xl w-full text-center mb-10 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 flex items-center justify-center gap-3 drop-shadow-lg">
          <i className="fas fa-university text-blue-400"></i>
          Portal Tugas Mahasiswa
        </h1>
        <p className="text-lg text-blue-100 opacity-90 drop-shadow-md">Sistem Pengumpulan & Absensi Online Terintegrasi</p>
      </header>

      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form & Attendance */}
        <div className="lg:col-span-1 space-y-6">
          <AttendanceClock />

          <section className="backdrop-blur-custom rounded-3xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <i className="fas fa-paper-plane text-blue-600"></i>
              Kumpul Tugas
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap Mahasiswa</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Masukkan nama sesuai KTM"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori Tugas</label>
                <select 
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value as AssignmentType)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-white"
                >
                  <option value={AssignmentType.JURNAL}>Jurnal</option>
                  <option value={AssignmentType.ARTIKEL}>Artikel Biasa</option>
                  <option value={AssignmentType.BEDAH_BUKU}>Bedah Buku</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Upload File (PDF/DOCX)</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition-colors bg-gray-50/50">
                  <input 
                    id="file-upload"
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx"
                  />
                  <div className="text-center">
                    <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600 truncate">
                      {file ? file.name : "Klik atau seret file ke sini"}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
                  isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner animate-spin"></i> Memproses...
                  </span>
                ) : 'Kirim Tugas & Absen Sekarang'}
              </button>
            </form>

            {showSuccess && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-bounce">
                <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                  <i className="fas fa-check-circle"></i> Berhasil Terkirim!
                </p>
                {lastFeedback && (
                  <p className="text-xs text-green-600 mt-2 italic font-serif">"{lastFeedback}"</p>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Submission History */}
        <div className="lg:col-span-2 space-y-6">
          <section className="backdrop-blur-custom rounded-3xl p-8 shadow-2xl border border-white/20 min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-history text-indigo-600"></i>
                Riwayat Pengumpulan
              </h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase">
                {submissions.length} Tugas Masuk
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <i className="fas fa-folder-open text-5xl mb-4 opacity-20"></i>
                <p>Belum ada tugas yang dikumpulkan hari ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow group relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">{sub.studentName}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <i className="fas fa-tag text-gray-400"></i> {sub.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="fas fa-clock text-gray-400"></i> Absen: {sub.attendanceTime}
                          </span>
                          <span className="flex items-center gap-1 text-blue-600 font-medium">
                            <i className="fas fa-file-alt"></i> {sub.fileName}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </div>
                    {sub.aiFeedback && (
                      <div className="mt-4 pt-4 border-t border-gray-50 text-sm italic text-gray-600 bg-gray-50/50 p-3 rounded-xl border-l-2 border-l-blue-300">
                        <i className="fas fa-robot text-blue-500 mr-2 opacity-70"></i>
                        {sub.aiFeedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Stats / Info Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow border border-white/40 flex items-center gap-4">
               <div className="bg-blue-100 p-3 rounded-xl"><i className="fas fa-info-circle text-blue-600"></i></div>
               <div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Deadline</div>
                  <div className="font-bold text-gray-800">23:59 WIB</div>
               </div>
            </div>
            <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow border border-white/40 flex items-center gap-4">
               <div className="bg-purple-100 p-3 rounded-xl"><i className="fas fa-shield-alt text-purple-600"></i></div>
               <div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Keamanan</div>
                  <div className="font-bold text-gray-800">E-Signed</div>
               </div>
            </div>
            <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow border border-white/40 flex items-center gap-4">
               <div className="bg-amber-100 p-3 rounded-xl"><i className="fas fa-headset text-amber-600"></i></div>
               <div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Bantuan</div>
                  <div className="font-bold text-gray-800">Chat Admin</div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 text-white/60 text-sm text-center">
        <p>&copy; 2024 Portal Tugas Mahasiswa - Universitas Unggul. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;
