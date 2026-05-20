import React from 'react';
import { Star, Volume2, Trash2, BookOpen } from 'lucide-react';
import { Word } from '../types';

interface WordCardProps {
  key?: string;
  word: Word;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDeleteWord?: (id: string) => void;
}

export default function WordCard({
  word,
  isFavorite,
  onToggleFavorite,
  onDeleteWord,
}: WordCardProps) {
  // TTS Pronunciation handler using HTML5 Web Speech API
  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert('Sizning brauzeringiz matnni nutqqa aylantirish (TTS) tizimini qo‘llab-quvvatlamaydi.');
      return;
    }

    // Cancel any current utterings in progress
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word.word);
    
    // Map language field to corresponding BCP-47 code
    switch (word.language) {
      case 'Inglizcha':
        utterance.lang = 'en-US';
        break;
      case 'Ruscha':
        utterance.lang = 'ru-RU';
        break;
      case 'Nemischa':
        utterance.lang = 'de-DE';
        break;
      case 'Turkcha':
        utterance.lang = 'tr-TR';
        break;
      case 'Arabcha':
        utterance.lang = 'ar-SA';
        utterance.rate = 0.8; // Slow down slightly for clear Arabic phonetic separation
        break;
      default:
        utterance.lang = 'en-US';
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="glass-panel word-card" id={`word-card-${word.id}`}>
      <div className="word-card-header" id={`card-hdr-${word.id}`}>
        <div className="word-meta" id={`card-meta-${word.id}`}>
          <span className="badge badge-lang" id={`badge-lang-${word.id}`}>
            {word.language}
          </span>
          <span className="badge badge-speech" id={`badge-speech-${word.id}`}>
            {word.partOfSpeech}
          </span>
          <span className="badge badge-level" id={`badge-level-${word.id}`}>
            {word.level}
          </span>
          {word.isCustom && (
            <span className="badge badge-custom" id={`badge-custom-${word.id}`}>
              O‘zingizniki
            </span>
          )}
        </div>

        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(word.id)}
          title={isFavorite ? 'Saralanganlardan o‘chirish' : 'Saralanganlarga qo‘shish'}
          id={`fav-btn-${word.id}`}
        >
          <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div id={`word-body-container-${word.id}`}>
        <div className="word-expression" id={`word-expr-${word.id}`}>
          {word.word}
          <button
            className="pronounce-btn"
            onClick={handlePronounce}
            title="Tinglash (Talaffuz)"
            aria-label="So‘zni talaffuz qilish"
            id={`voice-btn-${word.id}`}
          >
            <Volume2 size={14} />
          </button>
        </div>
        <p className="word-pronunciation" id={`word-pron-${word.id}`}>
          {word.pronunciation}
        </p>

        <p className="word-translation" id={`word-trans-${word.id}`}>
          {word.translation}
        </p>
      </div>

      <div className="card-divider" id={`divider-${word.id}`}></div>

      {/* Illustrative example sentences */}
      <div className="example-section" id={`example-sec-${word.id}`}>
        <span className="example-title">Misol gap:</span>
        <p className="example-orig" id={`example-orig-${word.id}`}>
          “{word.exampleOriginal}”
        </p>
        <p className="example-trans" id={`example-trans-${word.id}`}>
          {word.exampleTranslation}
        </p>
      </div>

      {/* Synonym Chips cloud */}
      {word.synonyms && word.synonyms.length > 0 && (
        <div className="synonyms-pile" id={`synonyms-pile-${word.id}`}>
          {word.synonyms.map((syn, idx) => (
            <span key={idx} className="synonym-chip" id={`synonym-${word.id}-${idx}`}>
              {syn}
            </span>
          ))}
        </div>
      )}

      {/* Delete button if word is added customly */}
      <div className="word-card-footer" id={`card-ftr-${word.id}`}>
        <div className="word-category-badge" id={`cat-badge-${word.id}`}>
          <BookOpen size={12} />
          <span>{word.category}</span>
        </div>

        {word.isCustom && onDeleteWord && (
          <button
            onClick={() => onDeleteWord(word.id)}
            className="delete-custom-btn"
            title="Bu so‘zni ro‘yxatdan butunlay o‘chirish"
            id={`delete-btn-${word.id}`}
          >
            <Trash2 size={13} />
            Yashirish
          </button>
        )}
      </div>
    </div>
  );
}
