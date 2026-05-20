import { BookOpen, Moon, Sun, Plus, Award } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenAddModal: () => void;
  openPracticeMode: () => void;
  isPracticeActive: boolean;
}

export default function Header({
  theme,
  toggleTheme,
  onOpenAddModal,
  openPracticeMode,
  isPracticeActive,
}: HeaderProps) {
  return (
    <header className="header glass-panel" id="main-header">
      <div className="logo-section" id="logo-section-container">
        <div className="logo-icon" id="logo-branding-avatar">
          <BookOpen size={22} />
        </div>
        <div className="logo-info" id="logo-brand-info">
          <h1>Online Lug‘at</h1>
          <p>Zamonaviy interaktiv so‘z boyligi va talaffuz platformasi</p>
        </div>
      </div>

      <div className="header-actions" id="actions-panel">
        <button
          onClick={openPracticeMode}
          className={`secondary-btn ${isPracticeActive ? 'chip active' : ''}`}
          title="Mashq qilish rejimini yuklash"
          id="toggle-practice-btn"
          style={{ whiteSpace: 'nowrap' }}
        >
          <Award size={18} />
          <span>{isPracticeActive ? 'Lug‘atga qaytish' : 'Mashq burchagi'}</span>
        </button>

        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘u rejimga o‘tish'}
          aria-label="Mavzuni almashtirish"
          id="theme-toggler"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="primary-btn"
          onClick={onOpenAddModal}
          id="open-add-dialog"
          title="Lug‘atga o‘z so‘zingizni qo‘shing"
        >
          <Plus size={18} />
          <span>Yangi so‘z</span>
        </button>
      </div>
    </header>
  );
}
