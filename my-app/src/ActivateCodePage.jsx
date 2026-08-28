import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from './SupabaseClient';
import { ShieldCheck, XCircle, Loader2 } from 'lucide-react';

export default function ActivateCodePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) {
      setStatus('error');
      setErrorMessage('No code provided in the URL.');
      return;
    }

    const verifyCode = async () => {
      try {
        // 1. Securely find the code in the database using RPC
        const { data: codeData, error: codeError } = await supabase
          .rpc('get_code_brand_slug', { p_code: code });

        if (codeError || !codeData || !codeData.success) {
          setStatus('error');
          setErrorMessage('This card code is invalid or does not exist.');
          return;
        }

        // 2. Check if the card has been assigned to a brand
        if (!codeData.brand_id) {
          setStatus('unassigned');
          return;
        }

        // 3. Card is assigned! Redirect to the brand's actual page
        const brandSlug = codeData.brand_slug;
        if (brandSlug) {
          navigate(`/${brandSlug}?code=${code}`, { replace: true });
        } else {
          setStatus('error');
          setErrorMessage('Brand configuration error. Please contact support.');
        }

      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setErrorMessage('A network error occurred while verifying your card.');
      }
    };

    verifyCode();
  }, [code, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
        <p className="text-sm tracking-widest text-gray-500 uppercase animate-pulse">Verifying Card Securely...</p>
      </div>
    );
  }

  if (status === 'unassigned') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white p-6">
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 max-w-lg text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-red-500"></div>
          
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-yellow-500" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-4">Card Not Yet Activated</h1>
          
          <p className="text-gray-400 font-light mb-8">
            This card is authentic but has not been assigned to a brand yet. 
            If you just received this card, the brand owner may still need to activate it in their system.
          </p>

          <div className="text-xs text-gray-600 font-mono">
            CODE: {code}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white p-6">
      <div className="bg-[#111] border border-red-500/30 rounded-3xl p-8 md:p-12 max-w-lg text-center shadow-2xl">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-black uppercase tracking-widest mb-4 text-red-500">Access Denied</h1>
        <p className="text-gray-400 font-light">
          {errorMessage}
        </p>
      </div>
    </div>
  );
}
