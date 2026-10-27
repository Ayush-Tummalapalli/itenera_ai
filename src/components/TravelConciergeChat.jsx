'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Compass, 
  Copy, 
  Check, 
  BookOpen, 
  ShieldCheck, 
  Languages, 
  Utensils, 
  Coins,
  Key,
  RotateCcw,
  Volume2,
  Train,
  CheckCircle2,
  Info
} from 'lucide-react';

const STATIC_SUGGESTIONS = [
  { icon: Train, label: 'Transit & Metro Pass', query: 'How does public transit work here, and what pass or card should I buy?' },
  { icon: Languages, label: 'Phrases & Greetings', query: 'What are essential local phrases and polite greetings I should know here?' },
  { icon: BookOpen, label: 'Local Etiquette', query: 'What are the most important cultural etiquette rules and customs I must respect?' },
  { icon: Utensils, label: 'Dining & Food Customs', query: 'What are the dining customs, must-try food specialties, and meal timings?' },
  { icon: Coins, label: 'Tipping & Cash Guide', query: 'What is the tipping etiquette here, and do I need cash or is contactless card widely accepted?' },
  { icon: ShieldCheck, label: 'Safety & Emergency', query: 'What are key safety tips, common scams to avoid, and emergency contact numbers?' }
];

export default function TravelConciergeChat({ itinerary }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [isLiveAI, setIsLiveAI] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your **Itinera Field Concierge**. Whether you need local etiquette, emergency phrases, dining customs, or transit advice for **${itinerary?.destination || 'your destination'}**, I'm here 24/7. How can I assist your travels today?`,
      suggestions: ['How to use transit here?', 'Show my Day 1 stops', 'Tipping etiquette']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  // Load custom key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('itinera_gemini_key') || '';
      setCustomKey(savedKey);
      if (savedKey.trim().length > 10) {
        setIsLiveAI(true);
      }
    }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Update greeting when destination changes
  useEffect(() => {
    if (itinerary?.destination) {
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I am your **Itinera Field Concierge**. Whether you need local etiquette, emergency phrases, dining customs, or transit advice for **${itinerary.destination}**, I'm here 24/7. How can I assist your travels today?`,
          suggestions: ['How to use transit here?', 'Show my Day 1 stops', 'Tipping etiquette', 'Safety & Emergency']
        }
      ]);
    }
  }, [itinerary?.destination]);

  const handleSaveKey = (e) => {
    if (e) e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('itinera_gemini_key', customKey.trim());
    }
    setIsLiveAI(customKey.trim().length > 10);
    setShowKeyModal(false);
  };

  const handleResetChat = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMessages([
      {
        role: 'assistant',
        content: `Conversation refreshed. How can I assist with your journey in **${itinerary?.destination || 'your destination'}**?`,
        suggestions: ['How to use transit here?', 'Show my Day 1 stops', 'Dining customs', 'Phrases & Greetings']
      }
    ]);
  };

  const handleSpeakText = (text, idx) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingIndex === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner speech
    const cleanSpeech = text
      .replace(/[*#_`>]/g, '')
      .replace(/•/g, '')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend) => {
    const userText = (textToSend || input).trim();
    if (!userText || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const activeKey = customKey.trim() || (typeof window !== 'undefined' ? localStorage.getItem('itinera_gemini_key') : '');

      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(activeKey ? { 'x-gemini-key': activeKey } : {})
        },
        body: JSON.stringify({
          messages: newMessages,
          destination: itinerary?.destination || 'Destination',
          apiKey: activeKey,
          tripContext: {
            title: itinerary?.tripTitle,
            summary: itinerary?.summary,
            companionType: itinerary?.companionType,
            estimatedBudgetPerPax: itinerary?.estimatedBudgetPerPax,
            preferences: itinerary?.preferences,
            days: (itinerary?.days || []).map(d => ({
              dayNumber: d.dayNumber,
              title: d.title,
              stops: (d.stops || []).map(s => `${s.time || ''} ${s.title} (${s.location || ''})`)
            }))
          }
        })
      });

      const data = await response.json();
      if (data && data.reply) {
        if (data.isLiveAI !== undefined) {
          setIsLiveAI(data.isLiveAI);
        }

        // Generate context-smart follow-up suggestions
        const nextSuggestions = [];
        const lowerQ = userText.toLowerCase();
        if (lowerQ.includes('transit') || lowerQ.includes('metro')) {
          nextSuggestions.push('What are the tipping rules?', 'Show Day 1 stops', 'Best dining spots');
        } else if (lowerQ.includes('food') || lowerQ.includes('dining')) {
          nextSuggestions.push('Essential local phrases', 'Is tap water safe?', 'Tipping etiquette');
        } else if (lowerQ.includes('day')) {
          nextSuggestions.push('Transit between stops', 'Best sunset viewpoints', 'Packing tips');
        } else {
          nextSuggestions.push('Transit & Metro passes', 'Dining & Food customs', 'Safety & Emergency');
        }

        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: data.reply,
            suggestions: nextSuggestions
          }
        ]);
      } else {
        throw new Error(data.error || 'No response from concierge.');
      }
    } catch (err) {
      console.error('Concierge chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Here is an essential field recommendation for **${itinerary?.destination || 'your destination'}**:\n\n` +
            `• **Transit**: Use official public metro/rail stations or licensed rideshares.\n` +
            `• **Navigation**: Download offline Google Maps for ${itinerary?.destination || 'your area'} so GPS works without cellular data.\n` +
            `• **Emergency**: Keep local emergency services (**112**) and your hotel business card saved on your phone.`,
          suggestions: ['How to use transit here?', 'Show my Day 1 stops', 'Dining customs']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <>
      {/* Floating Action Trigger Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 no-print">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#162842] text-white shadow-xl hover:bg-[#E05A3A] transition-all transform hover:-translate-y-0.5 border border-white/20"
            title="Ask AI Travel Concierge for local advice"
          >
            <div className="relative">
              <Compass className="w-5 h-5 text-[#F3785B] group-hover:text-white transition-colors animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#162842]" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold font-serif leading-tight">
                Field Concierge
              </span>
              <span className="block text-[10px] text-[#A0B3CC] group-hover:text-white/80 leading-none">
                {isLiveAI ? 'Gemini AI Active' : 'Field Intelligence'}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[94vw] sm:w-[440px] h-[580px] max-h-[88vh] rounded-2xl border border-[#E8E1D5] bg-[#FAF7F0] shadow-2xl flex flex-col overflow-hidden animate-fadeIn text-[#162842]">
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-[#E8E1D5] bg-[#162842] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E05A3A] flex items-center justify-center text-white font-serif font-bold text-sm shadow-sm">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm font-bold tracking-wide">
                    Itinera Concierge
                  </h3>
                  <button
                    onClick={() => setShowKeyModal(true)}
                    className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-colors"
                    title="Configure Gemini API Key"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isLiveAI ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span>{isLiveAI ? 'Gemini AI Live' : 'Field Engine'}</span>
                    <Key className="w-2.5 h-2.5 opacity-70" />
                  </button>
                </div>
                <p className="text-[10px] text-[#A0B3CC] truncate max-w-[210px]">
                  {itinerary?.destination || 'Field Knowledge Base'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-md text-[#A0B3CC] hover:text-white hover:bg-white/10 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md text-[#A0B3CC] hover:text-white hover:bg-white/10 transition-colors"
                title="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Starter Chips */}
          <div className="p-2.5 border-b border-[#E8E1D5] bg-[#F7F4EC] overflow-x-auto flex gap-1.5 scrollbar-none">
            {STATIC_SUGGESTIONS.map((sug, idx) => {
              const Icon = sug.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug.query)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-[#E8E1D5] bg-[#FDFBF7] text-[#162842] hover:border-[#E05A3A] hover:text-[#E05A3A] flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-[#E05A3A]" />
                  <span>{sug.label}</span>
                </button>
              );
            })}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF7F0]">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#162842] text-[#FAF7F0] rounded-br-none shadow-sm font-medium'
                        : 'bg-[#FDFBF7] text-[#162842] border border-[#E8E1D5] rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {!isUser && (
                      <div className="mt-2.5 pt-2 border-t border-[#E8E1D5] flex items-center justify-between text-[10px] text-[#526685]">
                        <span className="font-semibold text-[#E05A3A]">Itinera AI</span>
                        
                        <div className="flex items-center gap-2.5">
                          {/* Audio Speech Button */}
                          <button
                            onClick={() => handleSpeakText(msg.content, idx)}
                            className={`flex items-center gap-1 transition-colors ${
                              speakingIndex === idx ? 'text-[#E05A3A] font-bold' : 'hover:text-[#162842]'
                            }`}
                            title="Listen to audio pronunciation"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{speakingIndex === idx ? 'Playing...' : 'Listen'}</span>
                          </button>

                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopyMessage(msg.content, idx)}
                            className="flex items-center gap-1 hover:text-[#162842] transition-colors"
                            title="Copy advice to clipboard"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Follow-up Suggestion Chips */}
                  {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5 pl-1">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sug)}
                          disabled={isLoading}
                          className="px-2 py-0.5 rounded text-[10px] font-medium border border-[#E8E1D5] bg-[#F7F4EC] text-[#526685] hover:border-[#E05A3A] hover:text-[#E05A3A] transition-colors disabled:opacity-50"
                        >
                          → {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FDFBF7] border border-[#E8E1D5] w-fit shadow-sm">
                <Compass className="w-4 h-4 text-[#E05A3A] animate-spin" />
                <span className="text-xs text-[#526685] font-medium">
                  Consulting field knowledge base...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-[#E8E1D5] bg-[#F7F4EC] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask about transport, food, Day 1 stops in ${itinerary?.destination?.split(',')[0] || 'destination'}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-[#E8E1D5] bg-[#FAF7F0] text-xs text-[#162842] placeholder-[#8FA5C2] outline-none focus:border-[#E05A3A] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-lg bg-[#E05A3A] hover:bg-[#C94A2D] text-white transition-colors disabled:opacity-40"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Gemini API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF7F0] border border-[#E8E1D5] rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-[#162842] space-y-0">
            <div className="p-4 border-b border-[#E8E1D5] bg-[#F7F4EC] flex items-center justify-between">
              <div className="flex items-center gap-2 font-serif font-bold text-sm">
                <Key className="w-4 h-4 text-[#E05A3A]" />
                <span>AI Assistant Engine Settings</span>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded text-[#526685] hover:text-[#162842]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="p-5 space-y-4">
              <div className="p-3 rounded-md bg-[#FAECE8] border border-[#E05A3A]/30 text-xs text-[#162842] space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-[#E05A3A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dual-Engine Reliability Architecture</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  By default, Itinera uses its built-in high-speed <strong>Field Knowledge Engine</strong> that works 100% offline without any API key. If you have an official Google Gemini API Key, paste it below to enable live dynamic generation.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526685]">
                  Google Gemini API Key (Optional)
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-[#E8E1D5] bg-[#FDFBF7] text-xs font-mono text-[#162842] outline-none focus:border-[#E05A3A]"
                />
                <p className="text-[10px] text-[#526685]">
                  Keys are stored safely in your browser session and never sent to third parties.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E1D5]">
                {customKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomKey('');
                      if (typeof window !== 'undefined') localStorage.removeItem('itinera_gemini_key');
                      setIsLiveAI(false);
                      setShowKeyModal(false);
                    }}
                    className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    Clear Key
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 border border-[#E8E1D5] text-xs font-medium rounded text-[#526685] hover:text-[#162842]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#E05A3A] hover:bg-[#C94A2D] text-white text-xs font-semibold rounded flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
