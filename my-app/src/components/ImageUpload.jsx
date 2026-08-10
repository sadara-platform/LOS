import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';

export default function ImageUpload({ onUploadSuccess, currentImage, bucketName = 'brand-assets' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setErrorMsg('');
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }
    
    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File is too large. Maximum size is 5MB.');
      return;
    }

    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      setPreviewUrl(publicUrl);
      onUploadSuccess(publicUrl);
      
    } catch (error) {
      console.error('Upload Error:', error);
      setErrorMsg(error.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    onUploadSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {errorMsg && (
        <div className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-2">
          {errorMsg}
        </div>
      )}

      {previewUrl ? (
        <div className="relative w-full h-48 rounded-xl border border-white/10 overflow-hidden group bg-[#0A0A0A]">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <button 
              type="button"
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors flex items-center justify-center"
              aria-label="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`relative w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer bg-[#0A0A0A] 
            ${isDragging ? 'border-brand-red bg-brand-red/5 scale-[0.98]' : 'border-white/20 hover:border-white/50 hover:bg-white/5'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-brand-red">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Uploading Asset...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-zinc-500">
              <div className="bg-white/5 p-3 rounded-full mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-white mb-1">Drag & Drop Image</span>
              <span className="text-[10px] uppercase tracking-widest">or click to browse device</span>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/png, image/jpeg, image/webp" 
            className="hidden" 
          />
        </div>
      )}
    </div>
  );
}
