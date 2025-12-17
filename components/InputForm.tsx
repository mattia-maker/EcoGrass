import React from 'react';
import { FormData, GrassCondition } from '../types';
import { Settings2, Grid3X3, Sprout, Trash2, MapPin, Building2 } from 'lucide-react';

interface InputFormProps {
  data: FormData;
  onChange: (data: FormData) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ data, onChange, onSubmit, isGenerating }) => {
  
  const handleChange = (field: keyof FormData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
      <h2 className="text-xl font-semibold text-emerald-800 mb-6 flex items-center gap-2">
        <Settings2 className="w-5 h-5" />
        Configurazione Taglio
      </h2>

      <div className="space-y-6">
        
        {/* Location Section */}
        <div className="grid grid-cols-1 gap-4">
            {/* City Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Città Intervento
                </label>
                <input
                  type="text"
                  value={data.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Es. Cantù"
                />
            </div>

            {/* Address Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Indirizzo
                </label>
                <input
                  type="text"
                  value={data.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Via dei Prati 1"
                />
            </div>
        </div>

        {/* SQM */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-emerald-600" />
            Superficie Prato (mq)
          </label>
          <input
            type="number"
            min="10"
            value={data.sqm || ''}
            onChange={(e) => handleChange('sqm', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            placeholder="Es. 100"
          />
        </div>

        {/* Grass Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            Condizioni Erba
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(GrassCondition).map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => handleChange('condition', cond)}
                className={`px-4 py-2 text-sm rounded-lg border transition-all text-left ${
                  data.condition === cond
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        {/* Disposal Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <Trash2 className="w-4 h-4 text-emerald-600" />
            Smaltimento Erba
          </label>
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input 
              type="checkbox" 
              name="toggle" 
              id="toggle" 
              checked={data.includeDisposal}
              onChange={(e) => handleChange('includeDisposal', e.target.checked)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-full checked:border-emerald-500"
            />
            <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${data.includeDisposal ? 'bg-emerald-500' : 'bg-gray-300'}`}></label>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={isGenerating || !data.sqm}
          className={`w-full py-3 px-6 rounded-xl text-white font-semibold shadow-lg transition-all flex justify-center items-center gap-2 ${
            isGenerating || !data.sqm
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200/50'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calcolo Preventivo...
            </>
          ) : (
            'Calcola Costo Taglio'
          )}
        </button>
      </div>
    </div>
  );
};