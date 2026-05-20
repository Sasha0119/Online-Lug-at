import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, Filter, Award, X, BookOpen, VolumeX, ListFilter, HelpCircle, Star } from 'lucide-react';
import { Word, LanguageType, CategoryType } from './types';
import { INITIAL_WORDS, GENERAL_CATEGORIES, LANGUAGES } from './data/words';
import Header from './components/Header';
import StatsDashboard from './components/StatsDashboard';
import WordCard from './components/WordCard';
import QuizSection from './components/QuizSection';
import AddWordModal from './components/AddWordModal';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('dictionary-theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  // Words list state (pre-loaded + custom added in localStorage)
  const [words, setWords] = useState<Word[]>(() => {
    const savedCustom = localStorage.getItem('dictionary-custom-words');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom) as Word[];
        return [...INITIAL_WORDS, ...parsed];
      } catch (e) {
        console.error('Xatolik custom so‘zlarni yuklashda:', e);
        return INITIAL_WORDS;
      }
    }
    return INITIAL_WORDS;
  });

  // Favorite word IDs
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavs = localStorage.getItem('dictionary-favorites');
    if (savedFavs) {
      try {
        return JSON.parse(savedFavs) as string[];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Barchasi');
  const [selectedCategory, setSelectedCategory] = useState<string>('all-cats');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Custom CEFR level selector filter
  const [selectedLevel, setSelectedLevel] = useState<string>('Barchasi');

  // UI States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPracticeActive, setIsPracticeActive] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dictionary-theme', theme);
  }, [theme]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('dictionary-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Add custom word logic
  const handleAddWord = (newWord: Word) => {
    setWords((prev) => {
      const updated = [newWord, ...prev];
      
      // Save only custom words list to localStorage
      const customOnly = updated.filter((w) => w.isCustom);
      localStorage.setItem('dictionary-custom-words', JSON.stringify(customOnly));
      
      return updated;
    });
  };

  // Delete custom word
  const handleDeleteWord = (id: string) => {
    if (window.confirm('Haqiqatdan ham ushbu so‘zni lug‘atdan yashirishni xohlaysizmi?')) {
      setWords((prev) => {
        const updated = prev.filter((w) => w.id !== id);
        const customOnly = updated.filter((w) => w.isCustom);
        localStorage.setItem('dictionary-custom-words', JSON.stringify(customOnly));
        return updated;
      });

      // Clear from favorites if deleted
      setFavorites((prev) => prev.filter((favId) => favId !== id));
    }
  };

  // Toggle favorite trigger
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Filtered list memo implementation
  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      // Search term match (English words, phonetic transcription or Uzbek translation notes)
      const matchesSearch =
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.pronunciation.toLowerCase().includes(searchQuery.toLowerCase());

      // Language code matching
      const matchesLanguage = selectedLanguage === 'Barchasi' || w.language === selectedLanguage;

      // Category matching
      const matchesCategory = selectedCategory === 'all-cats' || w.category === selectedCategory;

      // Class difficulty leveling definition matching
      const matchesLevel = selectedLevel === 'Barchasi' || w.level === selectedLevel;

      // Favorites matching
      const matchesFavorites = !showOnlyFavorites || favorites.includes(w.id);

      return matchesSearch && matchesLanguage && matchesCategory && matchesLevel && matchesFavorites;
    });
  }, [words, searchQuery, selectedLanguage, selectedCategory, selectedLevel, showOnlyFavorites, favorites]);

  // Statistics memo implementation
  const stats = useMemo(() => {
    const total = words.length;
    const favoritesCount = favorites.length;
    return {
      total,
      favoritesCount,
    };
  }, [words, favorites]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('Barchasi');
    setSelectedCategory('all-cats');
    setSelectedLevel('Barchasi');
    setShowOnlyFavorites(false);
  };

  return (
    <div className="app-container" id="dictionary-main-app">
      {/* Top Header Panel */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        openPracticeMode={() => setIsPracticeActive((p) => !p)}
        isPracticeActive={isPracticeActive}
      />

      {/* Statistics Hub */}
      <StatsDashboard words={words} favorites={favorites} />

      {/* Main Control Hub for searching and sorting */}
      <div className="glass-panel control-hub" id="main-control-filtration-panel">
        <div className="search-wrapper" id="search-input-wrapper-container">
          <Search size={18} className="search-icon-pos" />
          <input
            type="text"
            className="search-input"
            placeholder="So‘z kiriting yoki o‘zbekcha tarjimasini qidiring... (Masalan: Benevolent kabi)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="So‘zlarni qidirish paneli"
            id="global-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search-clear-btn"
              title="Qidirishni bekor qilish"
              id="clear-search-query"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Categories of target language selection rows */}
        <div className="language-selector" id="language-tab-filters-row">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`chip ${selectedLanguage === lang.code ? 'active' : ''}`}
              title={`${lang.name} boyicha saralash`}
              id={`lang-tab-${lang.code}`}
            >
              <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Dashboard layout */}
      <div className="main-layout" id="applet-primary-layout-container">
        {/* Words Grid translation gallery */}
        <div className="content-panel" id="left-side-cards-gallery">
          <div className="section-title-wrap" id="gallery-header-info">
            <div>
              <h2 className="section-title">
                <BookOpen size={18} color="var(--primary)" />
                {showOnlyFavorites ? 'Saralangan Atamalar' : 'So‘zlar To‘plami'}
              </h2>
              <p className="section-subtitle">
                Filtrgacha mos kelgan so‘zlar: <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{filteredWords.length} ta</span>
              </p>
            </div>

            {/* Extra inline filter triggers */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className={`secondary-btn ${showOnlyFavorites ? 'chip active' : ''}`}
                onClick={() => setShowOnlyFavorites((prev) => !prev)}
                title="Faqat sevimlilarni ko‘rsatish"
                id="toggle-fav-filter"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                <Star size={13} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
                <span>Saralanganlar</span>
              </button>

              {(searchQuery || selectedCategory !== 'all-cats' || selectedLanguage !== 'Barchasi' || selectedLevel !== 'Barchasi' || showOnlyFavorites) && (
                <button
                  className="secondary-btn"
                  onClick={handleClearFilters}
                  title="Barcha filtrlarni tozalash"
                  id="reset-all-filters-shortcut"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', color: 'var(--danger)' }}
                >
                  Tozalash
                </button>
              )}
            </div>
          </div>

          {/* List display */}
          {filteredWords.length === 0 ? (
            <div className="glass-panel empty-state" id="no-words-fallback-panel">
              <div className="empty-state-icon">
                <VolumeX size={32} />
              </div>
              <h3>So‘z topilmadi</h3>
              <p>
                Qidiruv so‘rovingiz yoki tanlangan filtrlar bo‘yicha hech qanday lug‘at atamasi topilmadi. Qidiruv kalit so‘zini o‘zgartirib ko‘ring.
              </p>
              <button className="primary-btn" onClick={handleClearFilters} id="fallback-clear-btn" style={{ marginTop: '0.5rem' }}>
                Filtrlarni tiklash
              </button>
            </div>
          ) : (
            <div className="word-grid" id="main-vocabulary-cards-grid">
              {filteredWords.map((wordItem) => (
                <WordCard
                  key={wordItem.id}
                  word={wordItem}
                  isFavorite={favorites.includes(wordItem.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onDeleteWord={handleDeleteWord}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar displaying Category Filters, Level Filters, and interactive Quiz widget */}
        <aside className="sidebar" id="dictionary-right-aside-utility">
          {/* Category List Drawer */}
          <div className="glass-panel" id="category-selector-box">
            <h3 className="panel-header" id="category-box-heading">
              <ListFilter size={16} color="var(--primary)" />
              <span>Sohaviy Yo‘nalishlar</span>
            </h3>
            <div className="category-list" id="category-option-list">
              {GENERAL_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    className={`cat-item-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    id={`cat-btn-${cat.id}`}
                  >
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CEFR Level filter list */}
          <div className="glass-panel" id="level-selector-box">
            <h3 className="panel-header" id="level-box-heading">
              <Award size={16} color="var(--accent)" />
              <span>Murakkablik Darajasi</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }} id="level-option-grid">
              {['Barchasi', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
                const isActive = selectedLevel === lvl;
                return (
                  <button
                    key={lvl}
                    className={`chip ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedLevel(lvl)}
                    style={{ justifyContent: 'center', fontSize: '0.75rem', padding: '0.4rem 0' }}
                    id={`level-btn-${lvl}`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Dynamic Quiz Panel context */}
          <QuizSection words={words} />

          {/* Educational info panel */}
          <div className="glass-panel" id="educational-helper-info" style={{ pointerEvents: 'none' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <HelpCircle size={14} color="var(--info)" />
              Foydali Esdalik
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Har bir so‘z burchagidagi ko‘k ovoz belgisi orqali matnni ovozlashtiring! Bu sizning xorijiy tillarni talaffuz qilish mahoratingizni yaxshilaydi.
            </p>
          </div>
        </aside>
      </div>

      {/* Modal addition popup */}
      {isAddModalOpen && (
        <AddWordModal
          onClose={() => setIsAddModalOpen(false)}
          onAddWord={handleAddWord}
        />
      )}
    </div>
  );
}
