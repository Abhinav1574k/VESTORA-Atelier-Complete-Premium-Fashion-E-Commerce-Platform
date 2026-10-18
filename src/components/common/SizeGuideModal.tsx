'use client';

import React, { useState } from 'react';
import { X, Ruler, Sparkles, Check } from 'lucide-react';
import { Product } from '@/types';

interface SizeGuideModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
}

export default function SizeGuideModal({ product, isOpen, onClose, onSelectSize }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  // Smart size recommendation calculator state
  const [chestInput, setChestInput] = useState<number | ''>('');
  const [waistInput, setWaistInput] = useState<number | ''>('');
  const [fitPreference, setFitPreference] = useState<'Slim' | 'Regular' | 'Relaxed'>('Regular');
  const [calculatedSize, setCalculatedSize] = useState<string | null>(null);

  if (!isOpen) return null;

  // Measurement charts
  const measurementsInches = [
    { size: 'XS', chest: '34 - 36', waist: '28 - 29', hip: '34 - 36', length: '27.0' },
    { size: 'S', chest: '36 - 38', waist: '30 - 31', hip: '36 - 38', length: '27.5' },
    { size: 'M', chest: '38 - 40', waist: '32 - 33', hip: '38 - 40', length: '28.5' },
    { size: 'L', chest: '40 - 42', waist: '34 - 35', hip: '40 - 42', length: '29.5' },
    { size: 'XL', chest: '42 - 45', waist: '36 - 38', hip: '43 - 45', length: '30.5' },
    { size: 'XXL', chest: '46 - 48', waist: '39 - 41', hip: '46 - 48', length: '31.5' },
  ];

  const measurementsCm = [
    { size: 'XS', chest: '86 - 91', waist: '71 - 74', hip: '86 - 91', length: '68.5' },
    { size: 'S', chest: '91 - 96', waist: '76 - 79', hip: '91 - 96', length: '70.0' },
    { size: 'M', chest: '96 - 102', waist: '81 - 84', hip: '96 - 102', length: '72.5' },
    { size: 'L', chest: '102 - 107', waist: '86 - 89', hip: '102 - 107', length: '75.0' },
    { size: 'XL', chest: '107 - 114', waist: '91 - 97', hip: '109 - 114', length: '77.5' },
    { size: 'XXL', chest: '117 - 122', waist: '99 - 104', hip: '117 - 122', length: '80.0' },
  ];

  const activeTable = unit === 'in' ? measurementsInches : measurementsCm;

  const handleCalculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chestInput) return;

    let chestVal = Number(chestInput);
    if (unit === 'cm') {
      chestVal = chestVal / 2.54; // convert cm to inches for logic
    }

    let recommended = 'M';
    if (chestVal < 36) recommended = 'XS';
    else if (chestVal <= 38) recommended = 'S';
    else if (chestVal <= 40.5) recommended = 'M';
    else if (chestVal <= 43) recommended = 'L';
    else if (chestVal <= 46) recommended = 'XL';
    else recommended = 'XXL';

    // adjust for fit preference
    if (fitPreference === 'Relaxed') {
      if (recommended === 'S') recommended = 'M';
      else if (recommended === 'M') recommended = 'L';
      else if (recommended === 'L') recommended = 'XL';
    } else if (fitPreference === 'Slim') {
      if (recommended === 'L') recommended = 'M';
      else if (recommended === 'M') recommended = 'S';
    }

    setCalculatedSize(recommended);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#FCFBF9] rounded-2xl shadow-2xl border border-vestora-cream flex flex-col max-h-[90vh] overflow-y-auto z-10 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-vestora-cream">
          <div>
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-vestora-bronze" />
              <h3 className="font-serif text-lg font-medium text-vestora-charcoal">
                Atelier Sizing Guide & Fit Finder
              </h3>
            </div>
            <p className="text-xs text-vestora-muted mt-0.5">
              Garment: <span className="font-medium text-vestora-charcoal">{product.name}</span> ({product.specifications.fitType})
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-vestora-muted hover:text-vestora-charcoal rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Reference Banner */}
        {product.specifications.modelInfo && (
          <div className="my-4 p-3 bg-vestora-bone rounded-lg border border-vestora-sand text-xs flex flex-wrap gap-x-6 gap-y-1 text-vestora-charcoal">
            <span className="font-medium text-vestora-bronze">Model Reference:</span>
            <span>Height: <strong>{product.specifications.modelInfo.height}</strong></span>
            {product.specifications.modelInfo.chestOrBust && (
              <span>Chest: <strong>{product.specifications.modelInfo.chestOrBust}</strong></span>
            )}
            <span>Wears Size: <strong>{product.specifications.modelInfo.sizeWorn}</strong></span>
          </div>
        )}

        {/* Section 1: Smart Fit Finder Calculator */}
        <div className="bg-white p-5 rounded-xl border border-vestora-cream shadow-sm my-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-vestora-bronze mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Smart Size Recommendation Engine</span>
          </div>

          <form onSubmit={handleCalculateSize} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-vestora-muted mb-1">Chest ({unit}):</label>
              <input
                type="number"
                placeholder={unit === 'in' ? 'e.g. 40' : 'e.g. 101'}
                value={chestInput}
                onChange={(e) => setChestInput(e.target.value ? Number(e.target.value) : '')}
                required
                className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3 py-2 text-xs focus:outline-none focus:border-vestora-charcoal"
              />
            </div>
            <div>
              <label className="block text-vestora-muted mb-1">Waist ({unit}):</label>
              <input
                type="number"
                placeholder={unit === 'in' ? 'e.g. 32' : 'e.g. 81'}
                value={waistInput}
                onChange={(e) => setWaistInput(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3 py-2 text-xs focus:outline-none focus:border-vestora-charcoal"
              />
            </div>
            <div>
              <label className="block text-vestora-muted mb-1">Fit Silhouette:</label>
              <select
                value={fitPreference}
                onChange={(e) => setFitPreference(e.target.value as 'Slim' | 'Regular' | 'Relaxed')}
                className="w-full bg-vestora-ivory border border-vestora-cream rounded px-2.5 py-2 text-xs focus:outline-none focus:border-vestora-charcoal"
              >
                <option value="Slim">Tailored / Slim</option>
                <option value="Regular">Standard / Regular</option>
                <option value="Relaxed">Relaxed / Roomy</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-vestora-charcoal text-white rounded font-medium uppercase tracking-wider text-[11px] hover:bg-vestora-jet transition"
              >
                Calculate Fit
              </button>
            </div>
          </form>

          {calculatedSize && (
            <div className="mt-4 p-3 bg-vestora-bone rounded-lg border border-vestora-bronze/40 flex items-center justify-between animate-in fade-in">
              <div className="text-xs">
                <p className="font-semibold text-vestora-charcoal">
                  Recommended Size: <span className="font-serif text-base text-vestora-bronze font-bold">{calculatedSize}</span>
                </p>
                <p className="text-[11px] text-vestora-muted mt-0.5">
                  Based on your measurements and a {fitPreference.toLowerCase()} drape.
                </p>
              </div>
              {onSelectSize && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectSize(calculatedSize);
                    onClose();
                  }}
                  className="px-4 py-1.5 bg-vestora-bronze text-white text-[11px] font-semibold uppercase tracking-wider rounded hover:bg-[#856b4a] transition flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Select Size {calculatedSize}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Complete Measurements Table */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-vestora-charcoal">
              Detailed Garment Sizing Chart
            </h4>
            <div className="inline-flex rounded-md border border-vestora-cream bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded text-xs font-medium transition ${unit === 'in' ? 'bg-vestora-charcoal text-white' : 'text-vestora-muted hover:text-vestora-charcoal'
                  }`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded text-xs font-medium transition ${unit === 'cm' ? 'bg-vestora-charcoal text-white' : 'text-vestora-muted hover:text-vestora-charcoal'
                  }`}
              >
                Centimeters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-vestora-cream rounded-xl bg-white">
            <table className="w-full text-left text-xs divide-y divide-vestora-cream">
              <thead className="bg-vestora-bone text-vestora-charcoal uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Size</th>
                  <th className="py-2.5 px-4 font-semibold">Chest / Bust</th>
                  <th className="py-2.5 px-4 font-semibold">Waist</th>
                  <th className="py-2.5 px-4 font-semibold">Hips</th>
                  <th className="py-2.5 px-4 font-semibold">Garment Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vestora-cream">
                {activeTable.map((row) => (
                  <tr
                    key={row.size}
                    className={`hover:bg-vestora-ivory transition ${calculatedSize === row.size ? 'bg-vestora-bone/80 font-semibold' : ''
                      }`}
                  >
                    <td className="py-2.5 px-4 font-bold text-vestora-charcoal">{row.size}</td>
                    <td className="py-2.5 px-4 text-vestora-muted">{row.chest}</td>
                    <td className="py-2.5 px-4 text-vestora-muted">{row.waist}</td>
                    <td className="py-2.5 px-4 text-vestora-muted">{row.hip}</td>
                    <td className="py-2.5 px-4 text-vestora-muted">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure Instructions */}
        <div className="mt-5 p-4 bg-vestora-ivory border border-vestora-cream rounded-xl text-xs space-y-2 text-vestora-muted">
          <p className="font-semibold text-vestora-charcoal text-[11px] uppercase tracking-wider">
            How to Measure with Precision:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
            <li><strong>Chest:</strong> Wrap tape horizontally under your armpits across the fullest part of the chest/bust.</li>
            <li><strong>Waist:</strong> Measure around your natural waistline, keeping one finger between tape and body.</li>
            <li><strong>Hips:</strong> Stand with feet together and measure around the widest point of your hips.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
