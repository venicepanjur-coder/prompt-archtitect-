import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { PromptCard } from './components/PromptCard';
import { analyzeImageWithGemini, regeneratePrompts, adaptAnalysisWithTargetImage } from './services/geminiService';
import { ImageAnalysisState, PromptAnalysis, TargetMode, CreativityLevel } from './types';
import { AlertCircle, RefreshCw, Sparkles, Wand2, ArrowDown, User, Maximize, Lock, Scale, Palette } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<ImageAnalysisState>({
    file: null,
    previewUrl: null,
    secondFile: null,
    secondPreviewUrl: null,
    targetMode: 'subject_only', // Default to subject only
    creativityLevel: 'balanced', // Default to balanced
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const [isRegenerating, setIsRegenerating] = useState(false);

  // Handle Reference Image (Source of Style)
  const handleImageSelect = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    
    // Reset state for new analysis
    setState(prev => ({
      ...prev,
      file,
      previewUrl,
      secondFile: null,
      secondPreviewUrl: null,
      isAnalyzing: true,
      error: null,
      result: null
    }));

    try {
      const result = await analyzeImageWithGemini(file);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        result
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: error.message || "Something went wrong during analysis."
      }));
    }
  };

  // Handle Target Image (Subject to be styled)
  const handleSecondImageSelect = async (file: File) => {
    if (!state.result) return; 

    const secondPreviewUrl = URL.createObjectURL(file);
    
    setState(prev => ({
      ...prev,
      secondFile: file,
      secondPreviewUrl,
      isAnalyzing: true, 
      error: null
    }));

    try {
      // Pass the CURRENT analysis (Style Source), the NEW Image, and the MODE/CREATIVITY
      const blendedResult = await adaptAnalysisWithTargetImage(
        state.result.analysis, 
        file,
        state.targetMode,
        state.creativityLevel
      );
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        result: blendedResult 
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: error.message || "Something went wrong during prompt fusion."
      }));
    }
  };

  const handleTargetModeChange = async (mode: TargetMode) => {
    updateFusion(mode, state.creativityLevel);
  };

  const handleCreativityChange = async (level: CreativityLevel) => {
    updateFusion(state.targetMode, level);
  };

  const updateFusion = async (mode: TargetMode, level: CreativityLevel) => {
    setState(prev => ({ ...prev, targetMode: mode, creativityLevel: level }));
    
    if (state.secondFile && state.result) {
        setState(prev => ({ ...prev, isAnalyzing: true }));
        try {
            const blendedResult = await adaptAnalysisWithTargetImage(
                state.result.analysis, 
                state.secondFile,
                mode,
                level
            );
            setState(prev => ({
                ...prev,
                isAnalyzing: false,
                result: blendedResult
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isAnalyzing: false,
                error: error.message
            }));
        }
    }
  };

  const handleClear = () => {
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    if (state.secondPreviewUrl) URL.revokeObjectURL(state.secondPreviewUrl);
    
    setState({
      file: null,
      previewUrl: null,
      secondFile: null,
      secondPreviewUrl: null,
      targetMode: 'subject_only',
      creativityLevel: 'balanced',
      isAnalyzing: false,
      result: null,
      error: null
    });
  };

  const handleClearSecondImage = () => {
    if (state.secondPreviewUrl) URL.revokeObjectURL(state.secondPreviewUrl);
    
    setState(prev => ({
      ...prev,
      secondFile: null,
      secondPreviewUrl: null
    }));
    
    if (state.file) {
        handleImageSelect(state.file);
    }
  };

  const handlePromptChange = (key: keyof PromptAnalysis['generated_prompts'], value: string) => {
    setState(prev => {
      if (!prev.result) return prev;
      return {
        ...prev,
        result: {
          ...prev.result,
          generated_prompts: {
            ...prev.result.generated_prompts,
            [key]: value
          }
        }
      };
    });
  };

  const handleAnalysisChange = (key: keyof PromptAnalysis['analysis'], value: any) => {
    setState(prev => {
      if (!prev.result) return prev;
      return {
        ...prev,
        result: {
          ...prev.result,
          analysis: {
            ...prev.result.analysis,
            [key]: value
          }
        }
      };
    });
  };

  const handleRegeneratePrompts = async () => {
    if (!state.result) return;
    
    setIsRegenerating(true);
    try {
      const newPrompts = await regeneratePrompts(state.result.analysis);
      setState(prev => {
        if (!prev.result) return prev;
        return {
          ...prev,
          result: {
            ...prev.result,
            generated_prompts: newPrompts
          }
        };
      });
    } catch (error) {
      console.error("Failed to regenerate", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-primary-500/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section - Only show when no image selected */}
        {!state.previewUrl && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400">
              Turn Images into Prompts
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Upload any reference image. Our Gemini 3 Pro powered AI will deconstruct its visual DNA and generate optimized prompts for Nano Banana Pro.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Uploaders */}
          <div className={`lg:col-span-5 ${state.result ? 'lg:sticky lg:top-24 h-fit space-y-4' : 'lg:col-start-4 lg:col-span-6'}`}>
            
            {/* 1. Reference Image Uploader */}
            <div className="space-y-2">
              {state.result && <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1">1. Style / Reference Source</h3>}
              <ImageUploader 
                onImageSelect={handleImageSelect}
                selectedImage={state.previewUrl}
                isAnalyzing={state.isAnalyzing && !state.secondFile} 
                onClear={handleClear}
                label="Reference Image"
                subLabel="The source of style, lighting, and atmosphere"
                loadingMessage="Deconstructing Style..."
              />
            </div>

            {/* Arrow Connector */}
            {state.result && (
               <div className="flex justify-center text-slate-600">
                 <ArrowDown className="w-6 h-6 animate-bounce" />
               </div>
            )}

            {/* 2. Target Subject Uploader */}
            {state.result && (
              <div className="animate-fade-in space-y-3">
                 <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1">2. Target Subject (Optional)</h3>
                 
                 {/* TARGET CONTROLS */}
                 <div className="space-y-2">
                    {/* Mode Toggle */}
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
                        <button
                            onClick={() => handleTargetModeChange('subject_only')}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-all ${state.targetMode === 'subject_only' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            title="Extract subject, replace background"
                        >
                            <User className="w-3 h-3" />
                            Subject Only
                        </button>
                        <button
                            onClick={() => handleTargetModeChange('full_structure')}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-all ${state.targetMode === 'full_structure' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            title="Keep background, apply style overlay"
                        >
                            <Maximize className="w-3 h-3" />
                            Full Structure
                        </button>
                    </div>

                    {/* Creativity Slider */}
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
                         <button
                            onClick={() => handleCreativityChange('fidelity')}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-all ${state.creativityLevel === 'fidelity' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            title="High Fidelity: Stick strictly to the photo"
                        >
                            <Lock className="w-3 h-3" />
                            Fidelity
                        </button>
                        <button
                            onClick={() => handleCreativityChange('balanced')}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-all ${state.creativityLevel === 'balanced' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            title="Balanced: Mix subject with style"
                        >
                            <Scale className="w-3 h-3" />
                            Balanced
                        </button>
                        <button
                            onClick={() => handleCreativityChange('creative')}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-all ${state.creativityLevel === 'creative' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            title="Creative: Prioritize style aesthetics over subject accuracy"
                        >
                            <Palette className="w-3 h-3" />
                            Creative
                        </button>
                    </div>
                 </div>

                 <ImageUploader 
                  onImageSelect={handleSecondImageSelect}
                  selectedImage={state.secondPreviewUrl}
                  isAnalyzing={state.isAnalyzing && !!state.secondFile}
                  onClear={handleClearSecondImage}
                  label="Adapt to New Subject"
                  compact={true}
                  loadingMessage="Fusing Style & Subject..."
                />
                
                {/* Contextual Help Text */}
                <p className="text-xs text-slate-500 px-2 leading-relaxed">
                   {state.creativityLevel === 'fidelity' && "Prioritizes the exact look of the uploaded subject. Vfx may be subtle."}
                   {state.creativityLevel === 'balanced' && "Standard mode. Balances the subject's identity with the reference style."}
                   {state.creativityLevel === 'creative' && "Prioritizes the Reference Style aesthetics. The subject may change form significantly to fit the vibe."}
                </p>
              </div>
            )}
            
            {state.error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{state.error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          {state.result && (
            <div className="lg:col-span-7 space-y-8 animate-slide-up">
              
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-6 rounded-full ${state.secondFile ? 'bg-indigo-500' : 'bg-primary-500'}`}></span>
                    <h2 className="text-xl font-bold text-white">
                      {state.secondFile ? 'Fused Analysis' : 'Visual Analysis'}
                    </h2>
                  </div>
                  <button 
                    onClick={handleRegeneratePrompts}
                    disabled={isRegenerating || state.isAnalyzing}
                    className="flex items-center gap-2 px-4 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
                  >
                    {isRegenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    {isRegenerating ? 'Refining...' : 'Regenerate Prompts'}
                  </button>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  {state.secondFile 
                    ? "This analysis combines the STYLE of Image 1 with the SUBJECT of Image 2." 
                    : "Edit the analysis below to refine the generated prompts."}
                </p>
                <AnalysisDisplay 
                  data={state.result.analysis} 
                  onUpdate={handleAnalysisChange}
                />
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                  <h2 className="text-xl font-bold text-white">
                     {state.secondFile ? 'Fused Prompts' : 'Generated Prompts'}
                  </h2>
                </div>
                
                <div className="grid gap-4">
                  
                  {/* HERO CARD FOR NANO BANANA PRO */}
                  <div className="ring-2 ring-purple-500/50 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.15)] relative overflow-hidden">
                    {state.secondFile && (
                      <div className="absolute top-0 right-0 p-1 bg-purple-600/20 rounded-bl-xl border-b border-l border-purple-500/30">
                        <span className="text-[10px] text-purple-200 font-bold px-2 uppercase tracking-wide">Fusion Active</span>
                      </div>
                    )}
                    <PromptCard 
                      title="Nano Banana Pro (Gemini 3 Pro Image)" 
                      type="natural"
                      content={state.result.generated_prompts.nano_banana_pro_prompt}
                      onUpdate={(val) => handlePromptChange('nano_banana_pro_prompt', val)}
                    />
                  </div>

                  {/* JSON FORMAT */}
                  <div className="md:col-span-1">
                    <PromptCard 
                      title="Nano Banana Pro JSON Payload" 
                      type="json"
                      content={state.result.generated_prompts.nano_banana_pro_json}
                      onUpdate={(val) => handlePromptChange('nano_banana_pro_json', val)}
                    />
                  </div>
                  
                  <PromptCard 
                    title="Negative Prompt" 
                    type="negative"
                    content={state.result.generated_prompts.negative_prompt}
                    onUpdate={(val) => handlePromptChange('negative_prompt', val)}
                  />
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Simple footer */}
      <footer className="border-t border-slate-800 mt-20 py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} PromptArchitect AI. Powered by Google Gemini 3 Pro.</p>
      </footer>
    </div>
  );
}