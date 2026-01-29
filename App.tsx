
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { SubjectCard } from './components/SubjectCard';
import { ChatInterface } from './components/ChatInterface';
import { Auth } from './components/Auth';
import { Subject, Difficulty, User } from './types';

const SUBJECTS = [
  { id: Subject.Mathematics, icon: '📐', color: 'bg-blue-50 text-blue-600' },
  { id: Subject.Science, icon: '🧪', color: 'bg-emerald-50 text-emerald-600' },
  { id: Subject.History, icon: '🏛️', color: 'bg-amber-50 text-amber-600' },
  { id: Subject.Coding, icon: '💻', color: 'bg-indigo-50 text-indigo-600' },
  { id: Subject.Languages, icon: '🌍', color: 'bg-rose-50 text-rose-600' },
  { id: Subject.Philosophy, icon: '🧠', color: 'bg-purple-50 text-purple-600' },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Intermediate);

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const handleLogout = () => {
    setUser(null);
    setSelectedSubject(null);
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      {!selectedSubject ? (
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              What do you want to <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">learn today?</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl">
              Hey {user.name.split(' ')[0]}, choose a subject to start your personalized learning session with Lumina.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {SUBJECTS.map((s) => (
              <SubjectCard
                key={s.id}
                subject={s.id}
                icon={s.icon}
                color={s.color}
                isSelected={selectedSubject === s.id}
                onSelect={setSelectedSubject}
              />
            ))}
          </div>

          <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">✓</span>
              Session Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Knowledge Level</label>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  {Object.values(Difficulty).map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${difficulty === d ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-3">Learning Focus</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <FocusBadge label="Deep Dive" />
                    <FocusBadge label="Quick Review" />
                    <FocusBadge label="Exam Prep" />
                    <FocusBadge label="Homework" />
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <>
          <div className="px-8 pt-8 flex items-center justify-between">
            <button 
              onClick={() => setSelectedSubject(null)}
              className="flex items-center gap-2 text-slate-600 font-bold hover:text-indigo-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Subjects
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl">
               <span className="text-lg">✨</span>
               <span className="text-sm font-bold text-indigo-700">{difficulty} {selectedSubject}</span>
            </div>
          </div>
          <ChatInterface subject={selectedSubject} difficulty={difficulty} />
        </>
      )}
    </Layout>
  );
};

const FocusBadge: React.FC<{ label: string }> = ({ label }) => (
    <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 cursor-pointer transition-all">
        {label}
    </div>
);

export default App;
