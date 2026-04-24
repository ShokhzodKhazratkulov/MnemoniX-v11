import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Languages, 
  Target, 
  Award, 
  ChevronRight, 
  Check,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { Language, AppView, AppTheme } from '../types';
import { supabase } from '../supabaseClient';

interface Props {
  user: any;
  onComplete: (settings: { preferred_language: Language, daily_goal: number, ielts_goal: number }) => void;
}

export const Personalization: React.FC<Props> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState({
    preferred_language: Language.UZBEK,
    daily_goal: 50,
    ielts_goal: 7.0,
    app_theme: AppTheme.ORANGE
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          preferred_language: settings.preferred_language,
          daily_goal: settings.daily_goal,
          ielts_goal: settings.ielts_goal,
          app_theme: settings.app_theme,
          is_personalized: true
        })
        .eq('id', user.id);

      if (error) throw error;
      onComplete(settings);
    } catch (err) {
      console.error('Error saving personalization:', err);
      onComplete(settings);
    } finally {
      setIsSaving(false);
    }
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-4">
      <motion.div 
        layout
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl border border-gray-100 dark:border-slate-800 relative overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-slate-800">
          <motion.div 
            initial={false}
            animate={{ width: `${(step / 3) * 100}%` }}
            className="h-full bg-accent"
          />
        </div>

        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent rounded-xl flex items-center justify-center">
                    <Languages size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Native Language</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Mnemonics and translations will be in this language.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {Object.values(Language).filter(l => l !== Language.ENGLISH).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSettings({ ...settings, preferred_language: lang })}
                      className={`p-4 rounded-2xl border-2 transition-all font-bold text-left flex items-center justify-between active:scale-[0.97] touch-manipulation min-h-[64px] ${
                        settings.preferred_language === lang 
                          ? 'border-accent bg-accent/5 dark:bg-accent/10 text-accent dark:text-accent' 
                          : 'border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-accent/30'
                      }`}
                    >
                      <span className="truncate">{lang}</span>
                      {settings.preferred_language === lang && <Check size={18} className="flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                    <Target size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Daily Word Goal</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">How many words daily?</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[10, 20, 50, 100].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setSettings({ ...settings, daily_goal: goal })}
                      className={`p-6 rounded-2xl border-2 transition-all font-black text-center active:scale-[0.97] touch-manipulation ${
                        settings.daily_goal === goal 
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                          : 'border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:border-emerald-200'
                      }`}
                    >
                      <div className="text-3xl">{goal}</div>
                      <div className="text-[10px] uppercase tracking-widest mt-1 opacity-60">words / day</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                    <Award size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">IELTS Target</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Matched to your vocabulary level.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[6.0, 6.5, 7.0, 7.5, 8.0].map((band) => (
                    <button
                      key={band}
                      onClick={() => setSettings({ ...settings, ielts_goal: band })}
                      className={`p-5 rounded-2xl border-2 transition-all font-black text-center active:scale-[0.97] touch-manipulation ${
                        settings.ielts_goal === band 
                          ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
                          : 'border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:border-amber-200'
                      }`}
                    >
                      <div className="text-2xl">{band % 1 === 0 ? `${band}.0` : band}</div>
                      <div className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Band Score</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="w-full sm:flex-1 py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-2xl font-black hover:bg-gray-100 transition-all active:scale-[0.98] touch-manipulation"
              >
                Back
              </button>
            )}
            <button 
              onClick={() => step < 3 ? setStep(step + 1) : handleComplete()}
              disabled={isSaving}
              className="w-full sm:flex-[2] py-4 bg-accent text-white rounded-2xl font-black shadow-xl shadow-accent/20 dark:shadow-none hover:bg-accent-hover active:scale-[0.98] touch-manipulation transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {step === 3 ? "Start Learning" : "Next Step"}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Decorative Sparkles */}
        <div className="absolute -bottom-10 -right-10 text-accent/5 dark:text-accent/10 opacity-30 select-none">
          <Sparkles size={160} />
        </div>
      </motion.div>
    </div>
  );
};
