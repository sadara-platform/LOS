import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
import { QRCodeCanvas } from 'qrcode.react';

export default function PrintCardsPage() {
  const [quantity, setQuantity] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [isPrintingBacks, setIsPrintingBacks] = useState(false);

  const handleGenerateAndPrint = async () => {
    if (quantity < 1 || quantity > 500) {
      alert("Please select a quantity between 1 and 500.");
      return;
    }

    setIsGenerating(true);

    try {
      // 1. Get current exact count securely via the new Supabase RPC function (bypasses RLS)
      const { data: count, error: countError } = await supabase.rpc('get_codes_count');

      if (countError) {
        throw new Error("Failed to get database count: " + countError.message);
      }

      const startingNumber = (count || 0) + 1;

      // 2. Generate random codes with sequential numbers
      const newCodes = Array.from({ length: quantity }).map((_, index) => {
        const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
        return {
          code: randomStr,
          status: 'unused',
          cardNumber: startingNumber + index
        };
      });

      // 3. Insert into Supabase (saving card_number, omitting brand_id)
      const dbPayload = newCodes.map(c => ({
        code: c.code,
        status: c.status,
        card_number: c.cardNumber
      }));

      const { error } = await supabase
        .from('codes')
        .insert(dbPayload);

      if (error) throw error;

      // 4. Set generated codes to state for rendering
      setGeneratedCodes(newCodes);

      // 5. Wait for render, then print
      setTimeout(() => {
        window.print();
        setIsGenerating(false);
      }, 1000);

    } catch (err) {
      console.error("Error generating codes:", err);
      alert("Failed to generate codes. Error: " + (err.message || JSON.stringify(err)));
      setIsGenerating(false);
    }
  };

  const handlePrintBacks = () => {
    if (quantity < 1 || quantity > 500) {
      alert("Please select a quantity between 1 and 500.");
      return;
    }

    if (generatedCodes.length === 0) {
      alert("Please 'Generate & Print Fronts' first so we know which numbers to print on the backs!");
      return;
    }

    if (generatedCodes.length !== quantity) {
      alert(`Warning: The quantity selected (${quantity}) does not match the recently generated batch (${generatedCodes.length}). Please generate a new batch first.`);
      return;
    }

    setIsGenerating(true);
    setIsPrintingBacks(true);

    // We reuse the existing generatedCodes state because it contains the correct sequential cardNumbers

    setTimeout(() => {
      window.print();
      setIsGenerating(false);
      setIsPrintingBacks(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen text-white print-wrapper">

      {/* --- DASHBOARD UI (Hidden during print) --- */}
      <div className="p-8 max-w-4xl mx-auto hide-on-print">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">Card Printing Studio</h1>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 mb-8 shadow-xl">
          <h2 className="text-xl font-semibold mb-6">Setup Print Batch</h2>

          <div className="flex flex-col gap-2 mb-8 max-w-xs">
            <label className="text-gray-400 text-sm font-medium">Quantity to Print</label>
            <input
              type="number"
              min="1"
              max="500"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              disabled={isGenerating}
              className="bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleGenerateAndPrint}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all ${isGenerating
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                }`}
            >
              {isGenerating && !isPrintingBacks ? 'Generating...' : `Generate & Print Fronts`}
            </button>

            <button
              onClick={handlePrintBacks}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all ${isGenerating
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-[#1A1A1A] border border-white/20 text-white hover:bg-white/10'
                }`}
            >
              {isPrintingBacks ? 'Preparing Print...' : `Print ${quantity} Backs`}
            </button>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 text-blue-200 text-sm">
          <p className="font-semibold mb-2">How it works:</p>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>Select a brand to tie the generated codes to their specific campaign/budget.</li>
            <li>Clicking "Generate & Print Fronts" creates unique codes securely in the database.</li>
            <li>To print the backs of the cards, load your printed pages back into the printer and click "Print Backs".</li>
            <li>For best results, set margins to "None" in your print dialog.</li>
          </ul>
        </div>
      </div>

      {/* --- PRINT ONLY LAYOUT --- */}
      <div className="print-only-layout hidden">
        <div className="print-grid">
          {generatedCodes.map((item, index) => (
            <div key={index} className="print-card-slot">
              {isPrintingBacks ? (
                /* --- BACKFACE LAYOUT --- */
                <div className="relative w-full h-full overflow-hidden bg-black">
                  <img
                    src="/card_back.png"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    alt="Card Backface"
                  />
                  <div
                    className="absolute text-white/50 font-mono z-10"
                    style={{ top: '3%', left: '3%', fontSize: '6px' }}
                  >
                    {item.cardNumber}
                  </div>
                </div>
              ) : (
                /* --- FRONTFACE LAYOUT --- */
                <div className="relative w-full h-full overflow-hidden bg-black">
                  <img
                    src="/IMG_2571.PNG"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    alt="Card Background"
                  />

                  {/* QR Code replaces the grey box */}
                  <div
                    className="absolute flex items-center justify-center bg-white p-0.5 rounded-sm shadow-inner"
                    style={{ top: '72.15%', left: '77.19%', width: '13.44%', height: '19.53%' }}
                  >
                    <QRCodeCanvas
                      value={`https://11los11.netlify.app/activate?code=${item.code}`}
                      style={{ width: '100%', height: '100%' }}
                      level={"H"}
                      includeMargin={false}
                    />
                  </div>

                  {/* Card Number Overlay */}
                  <div
                    className="absolute text-white/50 font-mono z-10"
                    style={{ top: '0.5%', left: '1%', fontSize: '6px' }}
                  >
                    {item.cardNumber}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
