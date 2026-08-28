import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';

export default function AssignCardsPage() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [startNumber, setStartNumber] = useState('');
  const [endNumber, setEndNumber] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const { data, error } = await supabase.from('brands').select('id, name');
    if (data) {
      setBrands(data);
      if (data.length > 0) setSelectedBrand(data[0].id);
    } else if (error) {
      console.error('Error fetching brands:', error);
      setError('Failed to fetch brands');
    }
  };

  const handleAssign = async (forceParam = false) => {
    const force = typeof forceParam === 'boolean' ? forceParam : false;
    
    setMessage(null);
    setError(null);

    const start = parseInt(startNumber);
    const end = parseInt(endNumber);

    if (!selectedBrand) {
      setError('Please select a brand.');
      return;
    }
    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
      setError('Please enter a valid range. Start number must be <= End number.');
      return;
    }

    setIsAssigning(true);

    try {
      // Use the RPC function to bypass RLS securely
      const { data, error: rpcError } = await supabase.rpc('assign_cards_to_brand', {
        p_start_num: start,
        p_end_num: end,
        p_new_brand_id: selectedBrand,
        p_force: force
      });

      if (rpcError) throw rpcError;

      // Check if there were conflicts and we need confirmation
      if (data && data.success === false && data.conflicts > 0) {
        const confirmReassign = window.confirm(
          `Warning: ${data.conflicts} card(s) in this range are already assigned to another brand. Are you sure you want to change them to the new brand?`
        );
        if (confirmReassign) {
          // Re-run with force = true
          handleAssign(true);
          return;
        } else {
          setIsAssigning(false);
          return;
        }
      }

      if (data && data.updated === 0) {
        setError(`Warning: No cards were found in the range ${start} to ${end}. Please make sure you have generated them first.`);
      } else {
        setMessage(`Successfully assigned cards from ${start} to ${end} to the selected brand. (${data?.updated || 0} cards updated)`);
        setStartNumber('');
        setEndNumber('');
      }

    } catch (err) {
      console.error("Assignment error:", err);
      setError("Failed to assign cards: " + err.message);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Assign Pre-Printed Cards</h1>
      
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 mb-8 shadow-xl">
        <h2 className="text-xl font-semibold mb-6">Allocate Card Range to Brand</h2>
        
        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm font-medium">Select Brand</label>
            <select
              className="bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              disabled={isAssigning}
            >
              {brands.length === 0 && <option value="">Loading brands...</option>}
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm font-medium">Start Card Number</label>
            <input
              type="number"
              min="1"
              value={startNumber}
              onChange={(e) => setStartNumber(e.target.value)}
              disabled={isAssigning}
              className="bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="e.g. 100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm font-medium">End Card Number</label>
            <input
              type="number"
              min="1"
              value={endNumber}
              onChange={(e) => setEndNumber(e.target.value)}
              disabled={isAssigning}
              className="bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="e.g. 200"
            />
          </div>
        </div>

        <button
          onClick={handleAssign}
          disabled={isAssigning || !selectedBrand}
          className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg tracking-wide transition-all ${isAssigning || !selectedBrand
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
            }`}
        >
          {isAssigning ? 'Assigning...' : 'Assign Range'}
        </button>
      </div>
      
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 text-blue-200 text-sm">
        <p className="font-semibold mb-2">How it works:</p>
        <ul className="list-disc list-inside space-y-1 opacity-80">
          <li>Enter the range of physical card numbers you are giving to a specific brand.</li>
          <li>Once assigned, scanning the QR code on those cards will correctly activate the brand experience.</li>
          <li>If any cards in the range are already assigned to someone else, you will be warned before overwriting them.</li>
        </ul>
      </div>
    </div>
  );
}
