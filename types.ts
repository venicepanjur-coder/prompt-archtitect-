export interface PromptAnalysis {
  analysis: {
    subject: string;
    facial_features: string;
    action: string;
    vfx_class: string; // e.g. "Particle Dispersion", "Geometric Instancing"
    vfx_technique: string; // e.g. "Voxel-based scatter", "Eulerian fluid solver"
    vfx_interaction_verb: string;
    vfx_details: string;
    environment: string;
    lighting: string;
    color_grading: string;
    materiality: string;
    camera_lens: string;
    camera_type: string;
    camera_angle: string;
    style_tags: string[];
    detected_text: string;
  };
  generated_prompts: {
    nano_banana_pro_prompt: string;
    nano_banana_pro_json: string; // Stringified JSON object
    negative_prompt: string;
  };
}

export type TargetMode = 'subject_only' | 'full_structure';
export type CreativityLevel = 'fidelity' | 'balanced' | 'creative';

export interface ImageAnalysisState {
  file: File | null;
  previewUrl: string | null;
  secondFile: File | null;
  secondPreviewUrl: string | null;
  targetMode: TargetMode;
  creativityLevel: CreativityLevel;
  isAnalyzing: boolean;
  result: PromptAnalysis | null;
  error: string | null;
}