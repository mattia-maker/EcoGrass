import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { QuoteResults } from './components/QuoteResults';
import { FormData, GrassCondition, QuoteResult, CostBreakdown } from './types';
import { generateLawnAnalysis } from './services/geminiService';
import { Leaf, MessageCircle, Info } from 'lucide-react';
import { Logo } from './components/Logo';

const STORAGE_KEY = 'ecograss_mowing_v2';

function App() {
  const [formData, setFormData] = useState<FormData>({
    address: '',
    city: '',
    sqm: 0,
    condition: GrassCondition.MAINTAINED,
    includeDisposal: false
  });

  const [result, setResult] = useState<QuoteResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.formData && parsed.result) {
          setFormData(parsed.formData);
          setResult(parsed.result);
        }
      }
    } catch (error) {
      console.error("Errore nel recupero del preventivo salvato:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Logic for Mowing Estimation
  const calculateCosts = (data: FormData, distanceKm: number): CostBreakdown => {
    const { sqm, condition, includeDisposal } = data;
    
    // 1. Base Rate per SQM based on condition
    let ratePerSqm = 0;
    switch (condition) {
      case GrassCondition.MAINTAINED: ratePerSqm = 0.15; break;
      case GrassCondition.TALL: ratePerSqm = 0.25; break;
      case GrassCondition.OVERGROWN: ratePerSqm = 0.45; break;
    }
    
    // Base cost for the job (Labor + Machinery)
    const baseCutCost = Math.max(25, sqm * ratePerSqm); // Minimum 25 euro

    // Split Base Cost into Labor (70%) and Machinery/Fuel (30%)
    const laborCost = baseCutCost * 0.70;
    const machineryCost = baseCutCost * 0.30;

    // 2. Disposal Cost
    let disposalCost = 0;
    if (includeDisposal) {
       // 0.10 euro per sqm for collection and disposal fees
       disposalCost = Math.max(10, sqm * 0.10); 
    }

    // 3. Travel Cost
    // 0.80 euro per km (round trip implicit or just one way charged high? Let's say per km from base)
    // Minimum travel charge 10 euro
    const travelCost = Math.max(10, distanceKm * 1.5);

    // Apply 25% markup
    const markup = 1.25;

    const finalLabor = laborCost * markup;
    const finalMachinery = machineryCost * markup;
    const finalDisposal = disposalCost * markup;
    const finalTravel = travelCost * markup;

    const total = finalLabor + finalMachinery + finalDisposal + finalTravel;

    return {
      labor: Math.round(finalLabor),
      machinery: Math.round(finalMachinery),
      disposal: Math.round(finalDisposal),
      travel: Math.round(finalTravel),
      total: Math.round(total)
    };
  };

  const handleCalculate = async () => {
    setIsGenerating(true);
    setResult(null); 

    try {
      // 1. Get AI Analysis & Distance Estimation first
      const aiResponse = await generateLawnAnalysis(formData);
      const distance = aiResponse.distanceKm || 10; // Fallback

      // 2. Calculate costs using the estimated distance
      const costs = calculateCosts(formData, distance);
      
      // 3. Construct Result
      const newResult: QuoteResult = {
        breakdown: costs,
        aiAdvice: aiResponse.advice,
        distanceKm: distance
      };

      setResult(newResult);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        formData: formData,
        result: newResult
      }));

    } catch (e) {
      console.error("Error generating quote", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 px-4 sm:px-6 lg:px-8 relative bg-green-50">
      {/* Header */}
      <header className="max-w-5xl mx-auto pt-8 pb-12 flex flex-col items-center text-center">
        <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
          <Logo className="w-20 h-20 shadow-sm rounded-xl text-emerald-600" />
        </div>
        <h1 className="flex flex-col items-center font-bold text-gray-900 tracking-tight mb-4">
          <span className="text-3xl mb-1">
            <span className="text-emerald-600">Eco</span>Grass
          </span>
          <span className="text-gray-500 font-medium text-4xl">Preventivo Taglio Prato</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Calcola il costo per il taglio del tuo prato
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input */}
        <div className="lg:col-span-5">
          <div className="sticky top-8">
             <InputForm 
                data={formData} 
                onChange={setFormData} 
                onSubmit={handleCalculate}
                isGenerating={isGenerating}
             />
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          {result ? (
            <QuoteResults result={result} formData={formData} />
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
              <Leaf className="w-16 h-16 mb-4 opacity-20" />
              <p>Inserisci i dati per calcolare il preventivo</p>
            </div>
          )}
        </div>

      </main>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/393925525280"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-xl transition-all hover:scale-110 z-50 flex items-center justify-center"
        title="Contattaci su WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
      </a>
    </div>
  );
}

export default App;