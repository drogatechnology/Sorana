import { useState } from 'react';

export function HomeSuggestionSection() {
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-white py-24 w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-display text-[#111] mb-4">Have a Suggestion?</h2>
        <p className="text-[#666662] font-sans text-sm md:text-base max-w-2xl mb-12">
          We are always looking to improve our services and products. Let us know how we can serve you better.
        </p>
        
        <div className="w-full max-w-4xl">
          {submitted ? (
            <div className="bg-[#0A7C3F]/10 text-[#0A7C3F] p-6 text-center font-medium font-sans">
              Thank you for your valuable suggestion!
            </div>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <textarea 
                className="w-full bg-[#f7f7f5] border-none rounded-none p-6 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-[#0A7C3F]/20 font-sans text-base resize-none" 
                placeholder="Tell us what you'd like to see..."
                value={suggestion}
                onChange={e => setSuggestion(e.target.value)}
                required
              ></textarea>
              <button 
                type="submit"
                className="bg-[#111] text-white px-10 py-5 rounded-none font-sans font-bold hover:bg-[#0A7C3F] transition-colors self-end text-sm tracking-wide uppercase"
              >
                Submit Suggestion
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
