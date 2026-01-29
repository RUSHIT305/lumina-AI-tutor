
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Subject, Difficulty } from '../types';
import { getTutorResponse, generateVisualAid, speakExplanation, playAudio } from '../services/geminiService';

interface ChatInterfaceProps {
  subject: Subject;
  difficulty: Difficulty;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ subject, difficulty }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: 'text',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await getTutorResponse(input, subject, difficulty, history);

      const tutorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I'm sorry, I couldn't generate a response. Let's try again.",
        type: 'text',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, tutorMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestVisual = async (concept: string) => {
    setIsLoading(true);
    try {
        const url = await generateVisualAid(concept);
        if (url) {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: url,
                type: 'image',
                timestamp: Date.now()
            }]);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
        const audio = await speakExplanation(text);
        if (audio) {
            await playAudio(audio);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsSpeaking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden rounded-t-[40px] shadow-2xl mt-4 mx-4 border-x border-t border-slate-100">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
            🤖
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Lumina Tutor</h2>
            <p className="text-sm text-green-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online • Helping with {subject}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-sm font-semibold hover:bg-slate-100 transition-colors">
            Share Lesson
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-4xl mb-6">
              ✨
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to learn?</h3>
            <p className="text-slate-500">Ask me anything about {subject}. I can explain complex topics, solve problems, or even generate diagrams for you!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] group relative ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none'} p-4 shadow-sm`}>
              {msg.type === 'text' && (
                <div className="prose prose-slate prose-sm max-w-none">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0 leading-relaxed">{line}</p>
                  ))}
                </div>
              )}
              {msg.type === 'image' && (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                    <img src={msg.content} alt="Visual Aid" className="w-full h-auto" />
                </div>
              )}
              
              {msg.role === 'assistant' && msg.type === 'text' && (
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={() => handleSpeak(msg.content)}
                    disabled={isSpeaking}
                    className="p-2 bg-white/50 rounded-lg hover:bg-white transition-colors flex items-center gap-1 text-xs font-bold text-indigo-700 disabled:opacity-50"
                  >
                    {isSpeaking ? '🔊 Playing...' : '🔈 Read Aloud'}
                  </button>
                  <button 
                    onClick={() => requestVisual(msg.content.substring(0, 30))}
                    className="p-2 bg-white/50 rounded-lg hover:bg-white transition-colors flex items-center gap-1 text-xs font-bold text-emerald-700"
                  >
                    🖼️ Visualize
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-slate-50 border-t border-slate-100">
        <div className="flex gap-4 bg-white p-2 rounded-2xl shadow-lg border border-slate-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask about ${subject}...`}
            className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-800 font-medium placeholder:text-slate-400"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          Powered by Gemini AI • Always verify facts
        </p>
      </div>
    </div>
  );
};
