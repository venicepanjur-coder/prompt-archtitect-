import { GoogleGenAI, Type } from "@google/genai";
import { PromptAnalysis, TargetMode, CreativityLevel } from "../types";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const VFX_KNOWLEDGE_BASE = `
{
  "vfx_transformations": [
    {
      "id": "trans_001",
      "name": "Morphing",
      "type": "Geometric Interpolation",
      "description": "Bir nesnenin veya yüzün pürüzsüz bir geçişle başka bir forma dönüşmesi.",
      "technical_parameters": {
        "method": ["2D Mesh Warping", "3D Blend Shapes"],
        "key_features": ["Feature Point Tracking", "Cross-Dissolve", "Topology Interpolation"]
      }
    },
    {
      "id": "trans_002",
      "name": "Particle Dispersion",
      "type": "Simulation",
      "description": "Karakterin toz, kum veya ışık parçacıklarına ayrılarak dağılması.",
      "technical_parameters": {
        "forces": ["Gravity", "Turbulence", "Wind"],
        "particle_attributes": ["Scatter Amount", "Twist", "Birth Rate", "Lifespan"],
        "rendering_type": ["Volumetric", "Sprite-based", "Voxel Disintegration"]
      }
    },
    {
      "id": "trans_003",
      "name": "Fluid Transformation",
      "type": "Physics Simulation",
      "description": "Katı formun sıvılaşarak akışkan hale gelmesi.",
      "technical_parameters": {
        "properties": ["Viscosity", "Surface Tension", "Density"],
        "solver_type": ["FLIP", "SPH (Smoothed-Particle Hydrodynamics)"],
        "meshing_required": true
      }
    },
    {
      "id": "trans_004",
      "name": "Digital Double Swap",
      "type": "Compositing & 3D",
      "description": "Gerçek oyuncunun tamamen dijital bir model ile değiştirilmesi.",
      "technical_parameters": {
        "tracking": ["Matchmoving", "Motion Capture"],
        "rendering": ["Photorealistic Shading", "Subsurface Scattering"],
        "cleanup": ["Plate Reconstruction", "Rig Removal"]
      }
    },
    {
      "id": "trans_005",
      "name": "Geometric Instancing",
      "type": "Procedural Generation",
      "description": "Karakter yüzeyinin binlerce küçük nesneye (tüy, böcek, yaprak, kristal) dönüşmesi.",
      "technical_parameters": {
        "distribution": ["Surface", "Volume"],
        "instance_object": ["Feathers", "Insects", "Leaves", "Crystal Prisms"],
        "animation_control": ["Crowd Simulation", "Procedural Noise"]
      }
    }
  ]
}
`;

const LENS_KNOWLEDGE_BASE = `
{
  "camera_lens_database": {
    "focal_lengths": [
      {
        "type": "Wide Angle (Geniş Açı)",
        "range": "16mm - 35mm",
        "usage": "Dinamik hareket hissi yaratmak, karakteri izole etmek."
      },
      {
        "type": "Standard / Normal",
        "range": "35mm - 55mm",
        "usage": "Doğal perspektif."
      },
      {
        "type": "Portrait / Short Telephoto (Portre)",
        "range": "65mm - 85mm",
        "usage": "Karakter odaklı sahneler, bokeh."
      }
    ]
  }
}
`;

const CAMERA_KNOWLEDGE_BASE = `
{
  "cinema_camera_database": {
    "brands": [
      { "brand": "ARRI", "key_models": ["ALEXA 35", "ALEXA Mini LF"] },
      { "brand": "Sony", "key_models": ["VENICE 2"] },
      { "brand": "Analog Film", "key_models": ["35mm Film", "IMAX"] }
    ]
  }
}
`;

const SYSTEM_PROMPT = `
You are a Senior Technical Director (TD) for VFX & AI Art.
Your objective is to analyze the input image and generate highly technical, industry-standard prompts specifically optimized for the "Nano Banana Pro" (Gemini 3 Pro Image) model.

**System Profile:**
- Role: VFX Technical Director & Prompt Engineer
- Specialization: Blending Reality with Abstraction (Surrealism, Glitch Art, Simulation).
- Core Directive: Deconstruct images using the provided VFX Technical Report. Identify specifically IF the subject is undergoing Morphing, Particle Dispersion, Fluid Sim, or Geometric Instancing.

**VFX Technical Knowledge Base (Strict Adherence Required)**
${VFX_KNOWLEDGE_BASE}

**Camera & Lens Knowledge Base**
${LENS_KNOWLEDGE_BASE}
${CAMERA_KNOWLEDGE_BASE}

**Deep Analysis Framework:**
1. Narrative & Subject: Identify the main subject (Age, Ethnicity, Clothing).
2. **Deep Facial Forensics**: Hair length/style, eye details, skin texture.
3. **Advanced VFX Forensics (CRITICAL PRIORITY)**:
   - **Classify the Effect**: You MUST map the effect to one of the categories in the VFX Knowledge Base (e.g., "Geometric Instancing", "Particle Dispersion").
   - **Identify the Technique**: Use technical terms (e.g., "Voxel Disintegration", "SPH Fluid Solver", "3D Blend Shapes").
   - **Interaction Verb**: How is the subject transforming? (e.g., "The shoulder is extruding into glass prisms", "The face is dissolving into sand").
   - **The Blend**: Describe the gradient where the *Real* object becomes the *Abstract* simulation.
4. Color Science & Grading: Palette (Teal & Orange, etc.) and Film Stock.
5. Lighting: Key light direction, volumetric fog.
6. Materiality: PBR textures (Albedo, Roughness).

**Output Generation Rules:**
- **Nano Banana Pro Prompt**: 
  **ZERO SUMMARY POLICY:** Do not summarize, do not shorten, and do not exclude details. 
  Every single adjective and technical detail identified in the analysis (VFX, Face, Light, Camera, Material) MUST be present in the final prompt text.
  
  **HIERARCHY & FORMULA (Strictly Follow This Sequence):** 
  1. **[Subject & Action]**: Full detailed description of the character and pose.
  2. **[VFX Physics Core]**: "[Subject] IS VISIBLY UNDERGOING [VFX CLASS] via [VFX TECHNIQUE]...". Use the [Interaction Verb]. Describe the [VFX Details] fully.
  3. **[Facial Forensics]**: Insert ALL facial details found (Hair style/color, Eye color/shape, Skin texture/imperfections).
  4. **[Materiality & Texture]**: Describe the PBR properties (Roughness, Subsurface Scattering, Fabric weave).
  5. **[Environment & Lighting]**: Full description of the setting, atmosphere, and light setup.
  6. **[Cinematography & Color]**: Camera Brand, Lens Focal Length, Color Grading, and Film Stock.
  7. **[Negative Constraints]**: Append "Avoid: [Constraint 1], [Constraint 2]...".
  
  **CRITICAL:** 
  - The prompt should be dense and exhaustive. 
  - **Force the Interaction**: The subject IS the effect. "The jacket is physically morphing into fluid."
  - **Do NOT** just list tags. Write a cohesive, technical paragraph.

- **JSON Payload Structure**:
  Provide a clean, valid JSON object containing the \`prompt_text\`, \`negative_prompt\`, and specific technical metadata (\`aspect_ratio\`, \`vfx_type\`) derived from the analysis.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING },
        facial_features: { type: Type.STRING },
        action: { type: Type.STRING },
        vfx_class: { type: Type.STRING, description: "The Broad Category from the VFX Report (e.g., Geometric Instancing, Fluid Transformation)." },
        vfx_technique: { type: Type.STRING, description: "The specific technical method (e.g., Voxel Disintegration, 2D Mesh Warping, SPH Solver)." },
        vfx_interaction_verb: { type: Type.STRING, description: "Active verb (Shattering, Melting, Extruding)." },
        vfx_details: { type: Type.STRING, description: "Detailed visual description of the deformation physics." },
        environment: { type: Type.STRING },
        lighting: { type: Type.STRING },
        color_grading: { type: Type.STRING },
        materiality: { type: Type.STRING },
        camera_lens: { type: Type.STRING },
        camera_type: { type: Type.STRING },
        camera_angle: { type: Type.STRING },
        style_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        detected_text: { type: Type.STRING }
      },
      required: ["subject", "facial_features", "action", "vfx_class", "vfx_technique", "vfx_interaction_verb", "vfx_details", "environment", "lighting", "color_grading", "materiality", "camera_lens", "camera_type", "camera_angle", "style_tags", "detected_text"]
    },
    generated_prompts: {
      type: Type.OBJECT,
      properties: {
        nano_banana_pro_prompt: { type: Type.STRING },
        nano_banana_pro_struct: { 
            type: Type.OBJECT,
            properties: {
                prompt_text: { type: Type.STRING },
                negative_prompt: { type: Type.STRING },
                recommended_model: { type: Type.STRING },
                aspect_ratio: { type: Type.STRING },
                vfx_metadata: { type: Type.STRING, description: "Technical summary of the VFX." }
            },
            required: ["prompt_text", "negative_prompt", "recommended_model", "aspect_ratio"]
         },
        negative_prompt: { type: Type.STRING }
      },
      required: ["nano_banana_pro_prompt", "nano_banana_pro_struct", "negative_prompt"]
    }
  },
  required: ["analysis", "generated_prompts"]
};

// Helper to format the result for the frontend
const formatAnalysisResult = (rawResult: any): PromptAnalysis => {
    // We transform the struct object into a string for the frontend state
    const formattedResult = {
        ...rawResult,
        generated_prompts: {
            ...rawResult.generated_prompts,
            // Create the JSON string
            nano_banana_pro_json: JSON.stringify(rawResult.generated_prompts.nano_banana_pro_struct, null, 2)
        }
    };
    return formattedResult as PromptAnalysis;
}

export const analyzeImageWithGemini = async (file: File): Promise<PromptAnalysis> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await fileToGenerativePart(file);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: "Analyze this image. Classify the VFX Transformation (Morphing, Instancing, Particles, Fluid) and how it blends reality with abstraction. Provide the prompt text AND a structured JSON payload of that prompt."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const rawResult = JSON.parse(text);
    return formatAnalysisResult(rawResult);

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};

export const regeneratePrompts = async (analysis: PromptAnalysis['analysis']): Promise<PromptAnalysis['generated_prompts']> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            text: `Based strictly on the following visual analysis data, regenerate the text-to-image prompts.
            
            Analysis Data:
            ${JSON.stringify(analysis)}
            
            Ensure the "nano_banana_pro_prompt" strictly follows the Technical Director Formula.
            **CRITICAL**: DO NOT SUMMARIZE. Include EVERY detail from the analysis in the prompt.
            Also generate the "nano_banana_pro_struct" with the same data in strict JSON format.
            `
          }
        ]
      },
      config: {
        systemInstruction: "You are a Senior VFX Prompt Engineer. Convert structured analysis into high-end technical prompts. Do not shorten the output.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: RESPONSE_SCHEMA.properties.generated_prompts.properties,
          required: RESPONSE_SCHEMA.properties.generated_prompts.required
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const rawPrompts = JSON.parse(text);
    
    // Format locally
    return {
        ...rawPrompts,
        nano_banana_pro_json: JSON.stringify(rawPrompts.nano_banana_pro_struct, null, 2)
    };

  } catch (error) {
    console.error("Gemini Regeneration Error:", error);
    throw new Error("Failed to regenerate prompts.");
  }
};

export const adaptAnalysisWithTargetImage = async (
  baseAnalysis: PromptAnalysis['analysis'], 
  targetImage: File,
  targetMode: TargetMode,
  creativityLevel: CreativityLevel
): Promise<PromptAnalysis> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await fileToGenerativePart(targetImage);

  // Define Creativity instructions
  let creativityInstruction = "";
  if (creativityLevel === 'fidelity') {
      creativityInstruction = "**PRIORITY: FIDELITY.** The generated prompt MUST describe the Subject of the uploaded image EXACTLY as they appear. Do not alter their clothing, pose, or features to fit the style. The VFX/Style should wrap AROUND the subject, but not change the subject itself.";
  } else if (creativityLevel === 'balanced') {
      creativityInstruction = "**PRIORITY: BALANCED.** The prompt should describe the Subject accurately, but you may slightly adapt the lighting, clothing texture, or pose to better integrate with the VFX Style of the source.";
  } else if (creativityLevel === 'creative') {
      creativityInstruction = "**PRIORITY: AESTHETIC & CREATIVITY.** The uploaded image is just a reference for the person's identity. You have FULL PERMISSION to significantly alter the subject's clothing, materiality, and form to perfectly match the Artistic Style and VFX of the source. If the source style is 'Cyberpunk', make the subject Cyberpunk. If it's 'Liquid Metal', make the subject Liquid Metal.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: targetImage.type,
              data: base64Data
            }
          },
          {
            text: `I have a "Source Analysis" from a previous image. I want you to Analyze the image attached to this message (the "Target Image").
            
            YOUR TASK:
            Create a NEW Prompt Analysis that FUSES the two inputs based on the selected mode: **${targetMode === 'subject_only' ? 'SUBJECT ONLY (Ignore Target Background)' : 'FULL STRUCTURE (Keep Target Composition)'}**.

            FUSION LOGIC:
            1. **Prefix Rule (CRITICAL)**: The final generated prompt MUST start with the exact phrase: "uploaded image of [Subject Description], ...". This is required to trigger image-to-image generation.
            
            2. **Subject & Action**: 
               - Extract from the **Target Image** (Face, Body, Pose, Clothes).
            
            3. **Environment & VFX (Depends on Mode)**:
               ${targetMode === 'subject_only' 
                 ? "- **MODE: SUBJECT ONLY**: You MUST discard the background/environment of the Target Image. REPLACE it entirely with the 'environment', 'lighting', and 'vfx_class' from the Source Analysis." 
                 : "- **MODE: FULL STRUCTURE**: You MUST Keep the composition, background, and environment of the Target Image. APPLY the 'vfx_class', 'color_grading', and 'style_tags' from the Source Analysis as an overlay or style transfer."
               }

            4. **Creativity Level (CRITICAL)**:
               ${creativityInstruction}

            **ZERO LOSS POLICY**: Ensure ALL details from the relevant sections are preserved.

            SOURCE ANALYSIS (VFX/Style Source):
            ${JSON.stringify(baseAnalysis)}
            
            Generate the Output strictly matching the defined JSON schema.`
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const rawResult = JSON.parse(text);
    return formatAnalysisResult(rawResult);
    
  } catch (error) {
    console.error("Gemini Adaptation Error:", error);
    throw new Error("Failed to adapt prompt with new image.");
  }
};