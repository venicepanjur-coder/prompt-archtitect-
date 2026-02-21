import React from 'react';
import { PromptAnalysis } from '../types';
import { Aperture, Palette, Sun, MapPin, User, Type as TypeIcon, Layers, Camera, UserSearch, Zap, Settings } from 'lucide-react';

interface AnalysisDisplayProps {
  data: PromptAnalysis['analysis'];
  onUpdate: (key: keyof PromptAnalysis['analysis'], value: any) => void;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ data, onUpdate }) => {
  
  const InputField = ({ 
    label, 
    value, 
    field 
  }: { 
    label: string, 
    value: string, 
    field: keyof PromptAnalysis['analysis'] 
  }) => (
    <div className="mb-2 last:mb-0">
      <label className="text-xs text-slate-400 font-medium mb-1 block">{label}</label>
      <input 
        type="text"
        value={value}
        onChange={(e) => onUpdate(field, e.target.value)}
        className="w-full bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-slate-200 text-sm py-1 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors"
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Subject */}
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-blue-500">
        <div className="flex items-center gap-2 mb-3 text-blue-400">
          <User className="w-4 h-4" />
          <h3 className="font-semibold uppercase text-xs tracking-wider">Subject & Narrative</h3>
        </div>
        <InputField label="Subject Description" value={data.subject} field="subject" />
        <InputField label="Action & Pose" value={data.action} field="action" />
      </div>

       {/* Facial Forensics */}
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-purple-500">
        <div className="flex items-center gap-2 mb-3 text-purple-400">
          <UserSearch className="w-4 h-4" />
          <h3 className="font-semibold uppercase text-xs tracking-wider">Deep Facial Forensics</h3>
        </div>
        <textarea 
          value={data.facial_features}
          onChange={(e) => onUpdate('facial_features', e.target.value)}
          placeholder="Hair length/style, eye details, skin texture, age lines..."
          className="w-full h-20 bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-slate-200 text-sm py-1 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors resize-none"
        />
      </div>

      {/* VFX & Transformation - REVISED */}
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-pink-500">
        <div className="flex items-center gap-2 mb-3 text-pink-400">
          <Zap className="w-4 h-4" />
          <h3 className="font-semibold uppercase text-xs tracking-wider">VFX Technical Director</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
               <label className="text-xs text-slate-400 font-medium mb-1 block">VFX Class (Category)</label>
               <input 
                type="text"
                value={data.vfx_class || ''}
                onChange={(e) => onUpdate('vfx_class', e.target.value)}
                placeholder="e.g. Geometric Instancing"
                className="w-full bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-slate-200 text-sm py-1 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors"
              />
            </div>
            <div>
               <label className="text-xs text-slate-400 font-medium mb-1 block">Specific Technique</label>
               <input 
                type="text"
                value={data.vfx_technique || ''}
                onChange={(e) => onUpdate('vfx_technique', e.target.value)}
                placeholder="e.g. Voxel Disintegration"
                className="w-full bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-slate-200 text-sm py-1 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors"
              />
            </div>
        </div>
        <InputField label="Interaction Verb (e.g. Extruding, Shattering)" value={data.vfx_interaction_verb || ''} field="vfx_interaction_verb" />
        <textarea 
          value={data.vfx_details}
          onChange={(e) => onUpdate('vfx_details', e.target.value)}
          placeholder="Detailed physics of the deformation..."
          className="w-full h-16 bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-slate-200 text-sm py-1 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors resize-none"
        />
      </div>

      {/* Environment */}
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-2 mb-3 text-emerald-400">
          <MapPin className="w-4 h-4" />
          <h3 className="font-semibold uppercase text-xs tracking-wider">Environment & Atmosphere</h3>
        </div>
        <textarea 
          value={data.environment}
          onChange={(e) => onUpdate('environment', e.target.value)}
          className="w-full h-20 bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-slate-200 text-sm py-1 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors resize-none"
        />
      </div>

      {/* Lighting & Camera Physics */}
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-amber-500">
        <div className="flex items-center gap-2 mb-3 text-amber-400">
          <Sun className="w-4 h-4" />
          <h3 className="font-semibold uppercase text-xs tracking-wider">Lighting & Physics</h3>
        </div>
        <InputField label="Lighting Setup" value={data.lighting} field="lighting" />
        <InputField label="Composition & Angle" value={data.camera_angle} field="camera_angle" />
      </div>

       {/* Camera Lens & Optics */}
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-rose-500">
        <div className="flex items-center gap-2 mb-3 text-rose-400">
          <Camera className="w-4 h-4" />
          <h3 className="font-semibold uppercase text-xs tracking-wider">Cinematography Gear</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1 block">Camera Body & Sensor</label>
            <input 
              type="text"
              value={data.camera_type || ''}
              onChange={(e) => onUpdate('camera_type', e.target.value)}
              placeholder="ARRI Alexa, Sony Venice, IMAX Film..."
              className="w-full bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-slate-200 text-sm py-1 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1 block">Lens Characteristics</label>
            <textarea 
              value={data.camera_lens}
              onChange={(e) => onUpdate('camera_lens', e.target.value)}
              placeholder="Focal length, lens type (Anamorphic), specific series style (Cooke Look)..."
              className="w-full h-16 bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-slate-200 text-sm py-1 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Color Grading */}
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-indigo-500">
        <div className="flex items-center gap-2 mb-3 text-indigo-400">
          <Palette className="w-4 h-4" />
          <h3 className="font-semibold uppercase text-xs tracking-wider">Color Grading & Palette</h3>
        </div>
        <textarea 
          value={data.color_grading}
          onChange={(e) => onUpdate('color_grading', e.target.value)}
          placeholder="Teal & Orange, Pastel, Film Stock, Saturation..."
          className="w-full h-20 bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-slate-200 text-sm py-1 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors resize-none"
        />
      </div>

      {/* Materiality & Texture */}
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-cyan-500">
        <div className="flex items-center gap-2 mb-3 text-cyan-400">
          <Layers className="w-4 h-4" />
          <h3 className="font-semibold uppercase text-xs tracking-wider">Materiality & Texture</h3>
        </div>
        <textarea 
          value={data.materiality}
          onChange={(e) => onUpdate('materiality', e.target.value)}
          placeholder="Surface details, PBR properties, textures..."
          className="w-full h-20 bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-slate-200 text-sm py-1 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors resize-none"
        />
      </div>

      {/* Detected Text */}
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-orange-500">
        <div className="flex items-center gap-2 mb-3 text-orange-400">
          <TypeIcon className="w-4 h-4" />
          <h3 className="font-semibold uppercase text-xs tracking-wider">Typography</h3>
        </div>
        <textarea 
          value={data.detected_text}
          onChange={(e) => onUpdate('detected_text', e.target.value)}
          placeholder="Exact visible text..."
          className="w-full h-20 bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-slate-200 text-sm py-1 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors resize-none"
        />
      </div>

      {/* Style Tags */}
      <div className="glass-panel p-4 rounded-xl md:col-span-2 border-l-4 border-l-pink-500">
        <div className="flex items-center gap-2 mb-3 text-pink-400">
          <Palette className="w-4 h-4" />
          <h3 className="font-semibold uppercase text-xs tracking-wider">Artistic Style (comma separated)</h3>
        </div>
        <input 
          type="text"
          value={data.style_tags.join(', ')}
          onChange={(e) => onUpdate('style_tags', e.target.value.split(',').map(s => s.trim()))}
          className="w-full bg-slate-800/30 border-b border-white/10 focus:border-white/40 text-pink-200/90 text-sm py-2 px-1 focus:outline-none focus:bg-slate-800/50 transition-colors"
        />
      </div>
    </div>
  );
};