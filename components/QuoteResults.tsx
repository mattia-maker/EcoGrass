import React from 'react';
import { QuoteResult, FormData } from '../types';
import { Info, CheckCircle2, MessageCircle, Trash2 } from 'lucide-react';
import { Logo } from './Logo';

interface QuoteResultsProps {
  result: QuoteResult;
  formData: FormData;
}

export const QuoteResults: React.FC<QuoteResultsProps> = ({ result, formData }) => {
  const { breakdown, aiAdvice } = result;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  const addressPart = formData.address ? ` a ${formData.address}` : '';
  const cityPart = formData.city ? ` (${formData.city})` : '';
  const fullLocation = `${addressPart}${cityPart}`;

  const whatsappMessage = `Ciao EcoGrass, vorrei prenotare un taglio prato${fullLocation} di ${formData.sqm}mq. Preventivo stimato: ${formatCurrency(breakdown.total)}.`;
  const whatsappLink = `https://wa.me/393925525280?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Total Cost Card */}
      <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full -mr-10 -mt-10 opacity-50 blur-2xl"></div>
        
        {/* Logo Watermark */}
        <div className="absolute bottom-4 right-4 opacity-10">
          <Logo className="w-24 h-24 text-white fill-current" />
        </div>

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h3 className="text-emerald-200 text-sm font-medium uppercase tracking-wider mb-1">Costo Totale Stimato</h3>
            <div className="text-4xl font-bold mb-2">{formatCurrency(breakdown.total)}</div>
            <p className="text-emerald-300 text-sm flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Tutto incluso
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Smaltimento (se presente) */}
        {breakdown.disposal > 0 && (
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Raccolta e Smaltimento Erba</p>
              <p className="font-semibold text-lg text-gray-800">
                {formatCurrency(breakdown.disposal)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI Advice Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-emerald-500">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-600" />
          Consigli dell'Esperto
        </h3>
        <div className="prose prose-emerald text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
          {aiAdvice}
        </div>
      </div>

      {/* WhatsApp CTA Button */}
      <a 
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1 text-center flex items-center justify-center gap-3"
      >
        <MessageCircle className="w-6 h-6" />
        Prenota Taglio su WhatsApp
      </a>
    </div>
  );
};