import { Globe, Heart, Layers, FileCode } from 'lucide-react';
import { Word } from '../types';

interface StatsDashboardProps {
  words: Word[];
  favorites: string[];
}

export default function StatsDashboard({ words, favorites }: StatsDashboardProps) {
  // Count by languages available
  const languageSet = new Set(words.map((w) => w.language));
  const totalLanguages = languageSet.size;

  // Custom added words
  const customCount = words.filter((w) => w.isCustom).length;

  return (
    <div className="stats-grid" id="stats-system-dashboard">
      <div className="glass-panel stat-card" id="stat-total-words">
        <div className="stat-icon" id="stat-icon-total">
          <Layers size={20} />
        </div>
        <div className="stat-info" id="stat-info-total">
          <h2 id="total-words-count">{words.length}</h2>
          <p>Umumiy so‘zlar soni</p>
        </div>
      </div>

      <div className="glass-panel stat-card" id="stat-total-languages">
        <div className="stat-icon" id="stat-icon-languages">
          <Globe size={20} />
        </div>
        <div className="stat-info" id="stat-info-languages">
          <h2 id="total-languages-count">{totalLanguages}</h2>
          <p>O‘girtiriladigan tillar</p>
        </div>
      </div>

      <div className="glass-panel stat-card" id="stat-total-favorites">
        <div className="stat-icon" id="stat-icon-favorites">
          <Heart size={20} />
        </div>
        <div className="stat-info" id="stat-info-favorites">
          <h2 id="total-favorites-count">{favorites.length}</h2>
          <p>Saralangan so‘zlar</p>
        </div>
      </div>

      <div className="glass-panel stat-card" id="stat-total-custom">
        <div className="stat-icon" id="stat-icon-custom">
          <FileCode size={20} />
        </div>
        <div className="stat-info" id="stat-info-custom">
          <h2 id="total-custom-count">{customCount}</h2>
          <p>Siz qo‘shgan so‘zlar</p>
        </div>
      </div>
    </div>
  );
}
