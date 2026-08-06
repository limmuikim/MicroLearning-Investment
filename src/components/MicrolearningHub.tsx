import React, { useState } from 'react';
import { Lesson, UserPortfolio, CompanyStock } from '../types';
import { BookOpen, CheckCircle, Clock, Trophy, Bookmark, ArrowRight, ArrowLeft, HelpCircle, Sparkles, ChevronRight, Award, Zap, Shield, PieChart, BarChart3, TrendingUp, Landmark } from 'lucide-react';
import { OptionsPayoffVisualizer, RsiGaugeWidget, PositionSizerWidget, AssetAllocationSlider } from './InteractiveWidgets';

interface MicrolearningHubProps {
  lessons: Lesson[];
  companies: CompanyStock[];
  portfolio: UserPortfolio;
  onCompleteLesson: (lessonId: string, xp: number) => void;
  onToggleBookmark: (lessonId: string) => void;
  onSelectCompanyForAnalysis: (ticker: string) => void;
}

export const MicrolearningHub: React.FC<MicrolearningHubProps> = ({
  lessons,
  companies,
  portfolio,
  onCompleteLesson,
  onToggleBookmark,
  onSelectCompanyForAnalysis,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const tracks = [
    { id: 'all', label: 'All Modules' },
    { id: 'market_concepts', label: 'Market Essentials', icon: Landmark },
    { id: 'asset_allocation', label: 'Asset Allocation', icon: PieChart },
    { id: 'options_strategies', label: 'Call/Put Options', icon: Zap },
    { id: 'investment_analysis', label: 'Valuation & Earnings', icon: BarChart3 },
    { id: 'technical_analysis', label: 'Technical Charts', icon: TrendingUp },
    { id: 'risk_management', label: 'Risk Management', icon: Shield },
  ];

  const filteredLessons = selectedTrack === 'all'
    ? lessons
    : lessons.filter((l) => l.track === selectedTrack);

  const startLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentStepIndex(0);
    setShowQuiz(false);
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const handleNextStep = () => {
    if (!activeLesson) return;
    if (currentStepIndex < activeLesson.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowQuiz(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitQuiz = () => {
    if (!activeLesson) return;
    let correctCount = 0;
    activeLesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    setQuizScore(correctCount);
    setQuizSubmitted(true);

    if (correctCount === activeLesson.quiz.length) {
      onCompleteLesson(activeLesson.id, activeLesson.xpReward);
    }
  };

  // Render interactive widget inside lesson step if specified
  const renderInteractiveWidget = (widgetType?: string) => {
    switch (widgetType) {
      case 'options_payoff':
        return <OptionsPayoffVisualizer />;
      case 'rsi_gauge':
        return <RsiGaugeWidget />;
      case 'position_sizer':
        return <PositionSizerWidget />;
      case 'asset_slider':
        return <AssetAllocationSlider />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Active Lesson View Overlay / Reader */}
      {activeLesson ? (
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Back button & header bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setActiveLesson(null)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Microlearning Hub</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleBookmark(activeLesson.id)}
                className={`p-2 rounded-xl border transition-all ${
                  portfolio.bookmarkedLessonIds.includes(activeLesson.id)
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl">
                +{activeLesson.xpReward} XP Reward
              </span>
            </div>
          </div>

          {!showQuiz ? (
            /* Step Player */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2">
                  <span>
                    Step {currentStepIndex + 1} of {activeLesson.steps.length}: {activeLesson.steps[currentStepIndex].title}
                  </span>
                  <span>⏱️ 15-Min Daily Module</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / activeLesson.steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Step Subtitle & Title */}
              <div className="mb-6 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                  {activeLesson.steps[currentStepIndex].subtitle || activeLesson.title}
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  {activeLesson.steps[currentStepIndex].title}
                </h2>
              </div>

              {/* Main Content Body */}
              <div className="prose max-w-none text-slate-600 text-sm leading-relaxed space-y-4 mb-6">
                {activeLesson.steps[currentStepIndex].content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Embedded Interactive Widget */}
              {renderInteractiveWidget(activeLesson.steps[currentStepIndex].widget?.type)}

              {/* Featured Company Live Case Study Link */}
              {activeLesson.steps[currentStepIndex].featuredTicker && (
                <div className="my-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-extrabold text-indigo-600 text-sm shadow-sm">
                      {activeLesson.steps[currentStepIndex].featuredTicker}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Live Market Sector Case Study
                      </span>
                      <p className="text-xs font-semibold text-slate-800">
                        {activeLesson.steps[currentStepIndex].economicImpactNote ||
                          `Illustrating economic impact on ${activeLesson.steps[currentStepIndex].featuredTicker}.`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectCompanyForAnalysis(activeLesson.steps[currentStepIndex].featuredTicker!)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all shadow-sm"
                  >
                    <span>Analyze Ticker</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Key Takeaway Highlight Box */}
              <div className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-2xl mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Core 15-Min Takeaway
                  </span>
                </div>
                <p className="text-xs font-semibold text-indigo-950">
                  {activeLesson.steps[currentStepIndex].keyTakeaway}
                </p>
              </div>

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentStepIndex === 0
                      ? 'opacity-40 cursor-not-allowed text-slate-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
                >
                  <span>
                    {currentStepIndex < activeLesson.steps.length - 1 ? 'Next Step' : 'Proceed to Knowledge Quiz'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Knowledge Check Quiz */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">15-Min Mastery Quiz</h3>
                  <p className="text-xs text-slate-500">Test your understanding to claim your +{activeLesson.xpReward} XP</p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {activeLesson.quiz.map((q, qIndex) => (
                  <div key={q.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex gap-2">
                      <span className="text-indigo-600">Q{qIndex + 1}.</span>
                      <span>{q.question}</span>
                    </h4>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[q.id] === optIdx;
                        const isCorrect = q.correctIndex === optIdx;

                        let style = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300';
                        if (quizSubmitted) {
                          if (isCorrect) {
                            style = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold';
                          } else if (isSelected && !isCorrect) {
                            style = 'bg-rose-50 border-rose-300 text-rose-800 font-semibold';
                          }
                        } else if (isSelected) {
                          style = 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleAnswerSelect(q.id, optIdx)}
                            className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between shadow-sm ${style}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                          </div>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                        <span className="font-bold text-indigo-600 block mb-0.5">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit / Finish Actions */}
              {!quizSubmitted ? (
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(selectedAnswers).length < activeLesson.quiz.length}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                    Object.keys(selectedAnswers).length < activeLesson.quiz.length
                      ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400'
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
                  }`}
                >
                  Submit Answers & Claim XP
                </button>
              ) : (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                  <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <h4 className="text-lg font-bold text-slate-900">
                    Quiz Score: {quizScore} / {activeLesson.quiz.length} Correct
                  </h4>
                  <p className="text-xs text-slate-600 my-2">
                    {quizScore === activeLesson.quiz.length
                      ? `🎉 Perfect score! You earned +${activeLesson.xpReward} XP and extended your daily streak!`
                      : 'Review the explanations above to solidify your understanding.'}
                  </p>
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md"
                  >
                    Return to Microlearning Hub
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Microlearning Main Dashboard */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Hero Banner */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8 shadow-sm">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                  DAILY 15-MINUTE MICROLEARNING
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 1 Lesson A Day Keeps Drawdowns Away
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light mb-3 text-slate-900">
                Master Financial Markets <br />
                <span className="font-bold text-indigo-600">In 15 Minutes A Day</span>
              </h2>
              <p className="text-slate-500 leading-relaxed text-sm max-w-xl">
                Bite-sized modules covering asset allocation, options payoffs, valuation, technical chart analysis, and institutional risk management backed by live sector stock illustrations.
              </p>
            </div>

            {/* Quick Daily Lesson Spotlight Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 min-w-[300px]">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px]">🔥 Today's Featured Lesson</span>
                <span>15 Mins</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">{lessons[0].title}</h4>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{lessons[0].summary}</p>
              <button
                onClick={() => startLesson(lessons[0])}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Start 15-Min Lesson</span>
              </button>
            </div>
          </div>

          {/* Track Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 no-scrollbar">
            {tracks.map((track) => {
              const IconComp = track.icon;
              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedTrack === track.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {IconComp && <IconComp className="w-3.5 h-3.5" />}
                  <span>{track.label}</span>
                </button>
              );
            })}
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              const isCompleted = portfolio.completedLessonIds.includes(lesson.id);
              const isBookmarked = portfolio.bookmarkedLessonIds.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className={`group bg-white border rounded-3xl p-6 flex flex-col justify-between transition-all hover:border-indigo-300 shadow-sm ${
                    isCompleted ? 'border-emerald-200 bg-slate-50/50' : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Top badges */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                        {lesson.difficulty}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(lesson.id);
                          }}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isBookmarked
                              ? 'bg-amber-50 border-amber-200 text-amber-600'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {lesson.estimatedMinutes}m
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{lesson.summary}</p>

                    {/* Live Sector Company Tag */}
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 mb-6">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Featured Ticker:</span>
                      <span className="text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
                        ${lesson.featuredCompanyTicker}
                      </span>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-indigo-600">+{lesson.xpReward} XP</span>
                    
                    <button
                      onClick={() => startLesson(lesson)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Review Module</span>
                        </>
                      ) : (
                        <>
                          <span>Start Lesson</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
