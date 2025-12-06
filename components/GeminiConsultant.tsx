import React, { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { generateTattooConcept } from '../services/geminiService';

const GeminiConsultant: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    
    setLoading(true);
    setResponse(null);
    try {
      const result = await generateTattooConcept(idea);
      setResponse(result);
    } catch (err) {
      setResponse("Sorry, we couldn't generate a concept right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ink-slate/30 p-6 md:p-8 rounded-lg border border-ink-slate shadow-lg max-w-2xl mx-auto my-12">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-ink-gold animate-pulse" />
        <h3 className="text-2xl font-serif text-ink-gold">AI Design Consultant</h3>
      </div>
      <p className="text-gray-300 mb-6">
        Not sure what you want? Describe a feeling, a memory, or a symbol, and let our AI muse draft a creative concept description for you.
      </p>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            className="w-full bg-ink-dark border border-ink-mud rounded p-4 text-gray-200 focus:outline-none focus:border-ink-gold min-h-[100px]"
            placeholder="e.g., A lighthouse guiding a ship through a storm, but in a geometric style..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !idea.trim()}
            className="absolute bottom-4 right-4 bg-ink-gold text-ink-dark p-2 rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>

        {response && (
          <div className="mt-6 bg-ink-dark/50 p-6 rounded border-l-4 border-ink-gold animate-in fade-in slide-in-from-bottom-2">
            <h4 className="font-serif text-ink-gold mb-2">The Concept</h4>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-line">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiConsultant;
