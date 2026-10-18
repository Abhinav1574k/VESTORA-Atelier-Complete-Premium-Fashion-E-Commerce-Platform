'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Sparkles, Send, ArrowRight, Bot, User as UserIcon } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedProductIds?: string[];
}

export default function FashionAssistantModal() {
  const { isStylistOpen, setIsStylistOpen, products } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Good day. I am the Vestora Atelier Stylist & Fabric Concierge. How may I assist you with fabric compositions, GSM density, bespoke sizing, or occasion styling today?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isStylistOpen) return null;

  const quickPrompts = [
    'How do I care for 22-Momme Mulberry Silk?',
    'What size fits a 40-inch chest in the Oxford shirt?',
    'Recommend a look for a black-tie gala',
    'Explain 14oz Japanese raw denim & break-in',
    'Which items are GOTS Organic Certified?',
  ];

  const handleSendMessage = (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let recommendedIds: string[] = [];
      const lower = query.toLowerCase();

      if (lower.includes('silk') || lower.includes('momme') || lower.includes('slip dress')) {
        replyText =
          'Our Aurora Slip Dress is spun from certified 22-Momme Grade-6A Mulberry silk (95 GSM). Unlike synthetic satin, pure silk contains 18 natural amino acids that nourish skin and regulate body temperature. We recommend dry cleaning or hand-washing with pH-neutral silk wash in cold water.';
        recommendedIds = ['prod-001'];
      } else if (lower.includes('size') || lower.includes('chest') || lower.includes('oxford') || lower.includes('elysian')) {
        replyText =
          'For a 40-inch chest, our Elysian Egyptian Giza Cotton Oxford in Size M offers a trim, tailored modern fit. If you prefer extra ease around the shoulders for all-day desk work, Size L will provide a classic drape.';
        recommendedIds = ['prod-002'];
      } else if (lower.includes('gala') || lower.includes('evening') || lower.includes('wedding') || lower.includes('dressy')) {
        replyText =
          'For formal occasions, we recommend our Geneva Cashmere-Wool Coat layered over the Aurora Silk Slip Dress for women, or the Verona Super 130s Merino Trousers paired with our Elysian Oxford and solid brass side adjusters for men.';
        recommendedIds = ['prod-007', 'prod-004', 'prod-001'];
      } else if (lower.includes('denim') || lower.includes('selvedge') || lower.includes('okayama') || lower.includes('break')) {
        replyText =
          'Our Kuroki Mill 14oz Japanese Selvedge Denim is unwashed raw cotton. During the first 30-60 days of wear, the starch naturally creases around your knees and lap, creating custom personal fades and honeycombs. We advise avoiding washing for 3-6 months.';
        recommendedIds = ['prod-006'];
      } else if (lower.includes('gots') || lower.includes('organic') || lower.includes('sustainable')) {
        replyText =
          'Vestora strictly adheres to verified certifications. Our Oslo 480 GSM Hoodie and Florence 220 GSM Supima T-Shirts are 100% GOTS organic certified, dyed with non-toxic OEKO-TEX dyes, and completely free of polyester fleece.';
        recommendedIds = ['prod-005', 'prod-008'];
      } else {
        replyText =
          `I would recommend exploring our bestselling natural fiber pieces. Every garment in the Vestora collection includes verified fabric GSM, weave construction details, and honest care specifications.`;
        recommendedIds = ['prod-001', 'prod-002'];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          recommendedProductIds: recommendedIds,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsStylistOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-[#FCFBF9] rounded-2xl shadow-2xl border border-vestora-cream flex flex-col h-[600px] max-h-[90vh] overflow-hidden z-10">
        {/* Modal Header */}
        <div className="p-4 px-6 bg-vestora-jet text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-vestora-charcoal rounded-full border border-vestora-gold/40 text-vestora-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-medium tracking-wide">Vestora Atelier Stylist</h3>
              <p className="text-[10px] text-vestora-gold tracking-widest uppercase">Verified Fabric & Sizing AI</p>
            </div>
          </div>
          <button
            onClick={() => setIsStylistOpen(false)}
            className="p-1 text-vestora-taupe hover:text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="bg-vestora-bone/80 px-4 py-2 border-b border-vestora-cream flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="flex-shrink-0 px-3 py-1 bg-white border border-vestora-sand rounded-full text-vestora-charcoal hover:bg-vestora-cream hover:border-vestora-bronze transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-vestora-charcoal text-vestora-gold flex items-center justify-center flex-shrink-0 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${msg.sender === 'user'
                    ? 'bg-vestora-charcoal text-white rounded-br-none'
                    : 'bg-white border border-vestora-cream text-vestora-charcoal shadow-sm rounded-bl-none'
                  }`}
              >
                <p>{msg.text}</p>

                {/* Garment Recommendations inside chat */}
                {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-vestora-cream/70 space-y-2">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-vestora-bronze">
                      Recommended Garments:
                    </p>
                    {msg.recommendedProductIds.map((pid) => {
                      const prod = products.find((p) => p.id === pid);
                      if (!prod) return null;
                      return (
                        <Link
                          key={pid}
                          href={`/products/${prod.id}`}
                          onClick={() => setIsStylistOpen(false)}
                          className="flex items-center gap-3 p-2 bg-vestora-bone/70 hover:bg-vestora-bone rounded-lg transition"
                        >
                          <div className="w-10 h-12 relative flex-shrink-0 rounded overflow-hidden">
                            <Image
                              src={prod.variants[0]?.images[0] || ''}
                              alt={prod.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-vestora-charcoal truncate">{prod.name}</p>
                            <p className="text-[10px] text-vestora-muted">₹{prod.price.toLocaleString('en-IN')}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-vestora-bronze flex-shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-vestora-taupe text-vestora-jet flex items-center justify-center flex-shrink-0 text-xs">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-vestora-muted text-xs italic pl-10">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-vestora-bronze" />
              Consulting atelier garment archive...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-vestora-cream">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about fabric weight, stitching, sizes, or styling..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-vestora-ivory border border-vestora-cream rounded-full focus:outline-none focus:border-vestora-charcoal"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 bg-vestora-charcoal text-white rounded-full hover:bg-vestora-jet disabled:opacity-40 transition flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
