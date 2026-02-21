import React, { useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, X, ArrowRight } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: string | null;
  isAnalyzing: boolean;
  onClear: () => void;
  label?: string;
  subLabel?: string;
  compact?: boolean;
  loadingMessage?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  selectedImage, 
  isAnalyzing,
  onClear,
  label = "Upload an image to reverse-engineer",
  subLabel = "Drag and drop or click to upload. Supports JPG, PNG, WEBP.",
  compact = false,
  loadingMessage = "Analyzing Visual Structure..."
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (selectedImage) {
    return (
      <div className={`w-full relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800/50 shadow-2xl group ${compact ? 'h-48' : ''}`}>
         <img 
            src={selectedImage} 
            alt="Preview" 
            className={`w-full ${compact ? 'h-full' : 'max-h-[500px]'} object-cover bg-slate-900/50`}
          />
          
          {/* Overlay controls */}
          <div className="absolute top-2 right-2 flex gap-2">
             {!isAnalyzing && (
               <button 
                onClick={onClear}
                className="p-1.5 bg-slate-900/80 hover:bg-red-500/80 text-white rounded-full transition-colors backdrop-blur-sm border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
             )}
          </div>

          {isAnalyzing && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10 p-4 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-400 mb-3" />
              <p className="text-sm font-medium animate-pulse">{loadingMessage}</p>
            </div>
          )}
      </div>
    );
  }

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="w-full group relative"
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-2xl opacity-30 group-hover:opacity-100 transition duration-500 blur ${compact ? 'opacity-10' : ''}`}></div>
      <label 
        className={`relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-slate-600 bg-slate-900/90 hover:bg-slate-800/90 transition-all cursor-pointer overflow-hidden ${compact ? 'h-40' : 'h-80'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className={`mb-3 p-3 bg-slate-800 rounded-full group-hover:scale-110 transition-transform duration-300 ${compact ? 'scale-75' : ''}`}>
            {compact ? <ArrowRight className="w-6 h-6 text-primary-400" /> : <UploadCloud className="w-10 h-10 text-primary-400" />}
          </div>
          <p className={`mb-1 font-semibold text-white ${compact ? 'text-sm' : 'text-xl'}`}>
            {label}
          </p>
          {!compact && (
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              {subLabel}
            </p>
          )}
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};