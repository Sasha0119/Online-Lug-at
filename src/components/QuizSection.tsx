import { useState, useEffect } from 'react';
import { Award, Zap, Brain, RotateCcw, Check, X, Volume2 } from 'lucide-react';
import { Word, QuizQuestion } from '../types';

interface QuizSectionProps {
  words: Word[];
}

export default function QuizSection({ words }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);

  // Load a new random question
  const generateNewQuestion = () => {
    if (words.length < 4) {
      setCurrentQuestion(null);
      return;
    }

    // Pick a random word from the dictionary
    const randomIndex = Math.floor(Math.random() * words.length);
    const targetWord = words[randomIndex];

    // Pick 3 random wrong options
    const otherWords = words.filter((w) => w.id !== targetWord.id);
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
    const wrongTranslations = shuffledOthers.slice(0, 3).map((w) => w.translation);

    // Combine correct and wrong options, then shuffle
    const options = [...wrongTranslations, targetWord.translation].sort(() => 0.5 - Math.random());

    setCurrentQuestion({
      id: Math.random().toString(),
      word: targetWord,
      options: options,
      correctAnswer: targetWord.translation,
    });
    setSelectedOption(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    generateNewQuestion();
  }, [words]);

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(option);
    setIsAnswered(true);
    setTotalAttempts((prev) => prev + 1);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Dynamic pronunciation of the word when answering to double educational feedback!
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion.word.word);
      switch (currentQuestion.word.language) {
        case 'Inglizcha': utterance.lang = 'en-US'; break;
        case 'Ruscha': utterance.lang = 'ru-RU'; break;
        case 'Nemischa': utterance.lang = 'de-DE'; break;
        case 'Turkcha': utterance.lang = 'tr-TR'; break;
        case 'Arabcha': utterance.lang = 'ar-SA'; break;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleResetStats = () => {
    setCorrectCount(0);
    setTotalAttempts(0);
    setStreak(0);
    generateNewQuestion();
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  if (words.length < 4) {
    return (
      <div className="glass-panel quiz-box" id="quiz-empty-warning" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Savollarni shakllantirish uchun kamida 4 ta so‘z bo‘lishi lozim. Hozirda tarkibiy so‘zlar yetarli emas.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel quiz-box" id="educational-quiz-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="panel-header" id="quiz-header-title">
        <Brain size={20} color="var(--secondary)" />
        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Mashq burchagi (Quiz)</span>
      </div>

      <div className="quiz-score-header" id="quiz-stats-row">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Zap size={13} color="var(--accent)" />
          {streak > 0 ? `Ketma-ket: ${streak} ta 🔥` : 'Har kuni bilimingizni tekshiring'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="quiz-score-pill">
            Natija: {correctCount} / {totalAttempts}
          </span>
          {totalAttempts > 0 && (
            <span className="quiz-score-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              Anv: {accuracy}%
            </span>
          )}
        </div>
      </div>

      {currentQuestion && (
        <div id="quiz-body-content" style={{ margin: '0.5rem 0' }}>
          <div className="quiz-question-meta">
            Bu so‘zning to‘g‘ri tarjimasini toping <span className="badge badge-lang">{currentQuestion.word.language}</span>:
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <h3 className="quiz-question-word">
              {currentQuestion.word.word}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              ({currentQuestion.word.partOfSpeech})
            </span>
          </div>

          <div className="quiz-options" id="quiz-multiple-options-list">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = 'quiz-opt-btn';
              const isCorrectOpt = option === currentQuestion.correctAnswer;
              
              if (isAnswered) {
                if (isCorrectOpt) {
                  btnClass += ' correct';
                } else if (selectedOption === option && !isCorrectOpt) {
                  btnClass += ' wrong';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  className={btnClass}
                  disabled={isAnswered}
                  id={`quiz-opt-${idx}`}
                >
                  <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{option}</span>
                    {isAnswered && isCorrectOpt && <Check size={14} style={{ color: 'var(--success)' }} />}
                    {isAnswered && selectedOption === option && !isCorrectOpt && <X size={14} style={{ color: 'var(--danger)' }} />}
                  </span>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div id="quiz-score-feedback" style={{ marginTop: '1rem' }}>
              <div
                className={`quiz-feedback ${
                  selectedOption === currentQuestion.correctAnswer ? 'success' : 'error'
                }`}
                style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.75rem' }}
              >
                {selectedOption === currentQuestion.correctAnswer ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Check size={16} /> Ajoyib! To‘g‘ri javob berdingiz.
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <X size={16} /> Noto‘g‘ri. To‘g‘ri javob: "{currentQuestion.correctAnswer}"
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="primary-btn quiz-next-btn"
                  onClick={generateNewQuestion}
                  id="quiz-next-question-btn"
                >
                  Keyingi savol
                </button>
                <button
                  className="icon-btn"
                  onClick={handleResetStats}
                  title="Statistikani nolga tushirish"
                  id="quiz-reset-stats"
                  style={{ alignSelf: 'stretch', width: '44px', marginTop: '1rem' }}
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
