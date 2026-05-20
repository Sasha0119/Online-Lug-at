import React, { useState } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import { Word, LanguageType, CategoryType } from '../types';

interface AddWordModalProps {
  onClose: () => void;
  onAddWord: (word: Word) => void;
}

export default function AddWordModal({ onClose, onAddWord }: AddWordModalProps) {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [language, setLanguage] = useState<LanguageType>('Inglizcha');
  const [category, setCategory] = useState<CategoryType>('Kundalik');
  const [partOfSpeech, setPartOfSpeech] = useState('Ot');
  const [pronunciation, setPronunciation] = useState('');
  const [exampleOriginal, setExampleOriginal] = useState('');
  const [exampleTranslation, setExampleTranslation] = useState('');
  const [synonymsInput, setSynonymsInput] = useState('');
  const [level, setLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('B1');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!word.trim() || !translation.trim()) {
      setErrorMsg('Iltimos, so‘z va uning tarjimasini kiriting!');
      return;
    }

    const separatedSynonyms = synonymsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const generatedPronunciation = pronunciation.trim() || `/${word.toLowerCase().trim()}/`;

    const newWordItem: Word = {
      id: `custom-${Date.now()}`,
      word: word.trim(),
      translation: translation.trim(),
      language,
      category,
      partOfSpeech: partOfSpeech.trim() || 'Ot',
      pronunciation: generatedPronunciation,
      exampleOriginal: exampleOriginal.trim() || 'Misol uchun gap yozilmagan.',
      exampleTranslation: exampleTranslation.trim() || 'Tarjimalar mavjud emas.',
      synonyms: separatedSynonyms,
      level,
      isCustom: true,
    };

    onAddWord(newWordItem);
    onClose();
  };

  return (
    <div className="modal-overlay" id="add-word-modal-overlay" onClick={onClose}>
      <div className="modal-content" id="add-word-modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
            <Sparkles size={20} color="var(--primary)" />
            Yangi So‘z Qo‘shish
          </h2>
          <button className="icon-btn" onClick={onClose} aria-label="Yopish" id="close-modal-btn">
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ color: 'var(--danger)', fontSize: '0.8rem', padding: '0.5rem', background: 'rgba(239, 44, 44, 0.1)', borderRadius: '4px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid" id="add-word-form">
          <div className="field-group">
            <label className="field-label">Atama / Word</label>
            <input
              type="text"
              className="textbox"
              placeholder="Masalan: Awesome"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
              id="input-val-word"
            />
          </div>

          <div className="field-group">
            <label className="field-label">O‘zbekcha Tarjimasi</label>
            <input
              type="text"
              className="textbox"
              placeholder="Masalan: Juda ajoyib"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              required
              id="input-val-translation"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Tillar turkumi</label>
            <select
              className="textbox"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageType)}
              id="input-val-language"
            >
              <option value="Inglizcha">Inglizcha (EN)</option>
              <option value="Ruscha">Ruscha (RU)</option>
              <option value="Nemischa">Nemischa (DE)</option>
              <option value="Turkcha">Turkcha (TR)</option>
              <option value="Arabcha">Arabcha (AR)</option>
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">Talab / Daraja</label>
            <select
              className="textbox"
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              id="input-val-level"
            >
              <option value="A1">A1 - Boshlang‘ich</option>
              <option value="A2">A2 - Oddiy</option>
              <option value="B1">B1 - O‘rta</option>
              <option value="B2">B2 - Mustaqil</option>
              <option value="C1">C1 - Murakkab</option>
              <option value="C2">C2 - Professional</option>
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">Kategoriya</label>
            <select
              className="textbox"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              id="input-val-category"
            >
              <option value="Kundalik">Kundalik ehtiyoj</option>
              <option value="Texnologiya">Texnologiya</option>
              <option value="Biznes">Biznes & Moliya</option>
              <option value="Ta’lim">Ta’lim & Ilm-fan</option>
              <option value="Sayohat">Sayohat & Turizm</option>
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">So‘z Turkumi (Grammatika)</label>
            <input
              type="text"
              className="textbox"
              placeholder="Sifat, Ot, Fe’l, Son"
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              id="input-val-part-of-speech"
            />
          </div>

          <div className="field-group form-full">
            <label className="field-label">Talaffuz / Transkripsiya (Ixtiyoriy)</label>
            <input
              type="text"
              className="textbox"
              placeholder="/ˈɔːsəm/ kabi belgilang"
              value={pronunciation}
              onChange={(e) => setPronunciation(e.target.value)}
              id="input-val-pronunciation"
            />
          </div>

          <div className="field-group form-full">
            <label className="field-label">Misol gap (original tilda)</label>
            <input
              type="text"
              className="textbox"
              placeholder="Masalan: Learning languages is awesome."
              value={exampleOriginal}
              onChange={(e) => setExampleOriginal(e.target.value)}
              id="input-val-example-orig"
            />
          </div>

          <div className="field-group form-full">
            <label className="field-label">Misol gapning O‘zbekcha o‘girilishi</label>
            <input
              type="text"
              className="textbox"
              placeholder="Masalan: Tillar o‘rganish juda ajoyib ishtiyoqdir."
              value={exampleTranslation}
              onChange={(e) => setExampleTranslation(e.target.value)}
              id="input-val-example-trans"
            />
          </div>

          <div className="field-group form-full">
            <label className="field-label">Sinonimlar (vergul bilan ajrating)</label>
            <input
              type="text"
              className="textbox"
              placeholder="Masalan: Great, Incredible, Stunning"
              value={synonymsInput}
              onChange={(e) => setSynonymsInput(e.target.value)}
              id="input-val-synonyms"
            />
          </div>

          <div className="form-actions form-full">
            <button type="button" className="secondary-btn" onClick={onClose} id="cancel-form">
              Bekor qilish
            </button>
            <button type="submit" className="primary-btn" id="submit-form">
              <Save size={16} />
              <span>Lug‘atga saqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
