import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cropName, soilPh, location, landSize } = await req.json();
    console.log('Generating planting guide for:', cropName);

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const prompt = `You are an expert agricultural consultant specializing in detailed crop cultivation guidance. Provide comprehensive planting instructions for the specified crop.

Crop: ${cropName}
Location: ${location}
Soil pH: ${soilPh}
Land Size: ${landSize} hectares

Please provide a detailed planting guide with spacing, fertilization, pest control, irrigation, expected yield, and harvest time.

Return your response in this exact JSON format:
{
  "name": "Crop name",
  "spacing": "Detailed spacing requirements",
  "fertilization": "Fertilization schedule and amounts",
  "pestControl": "Pest and weed control strategies",
  "irrigation": "Water requirements and irrigation schedule",
  "expectedYield": "Expected yield range per hectare",
  "harvestTime": "Time to harvest from planting"
}`;

    const callGemini = () => fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    let response = await callGemini();
    for (let attempt = 1; attempt <= 3 && (response.status === 503 || response.status === 429 || response.status >= 500); attempt++) {
      await response.text();
      const delay = 1000 * 2 ** (attempt - 1) + Math.random() * 500;
      console.log(`Gemini busy (${response.status}), retry ${attempt} in ${Math.round(delay)}ms`);
      await new Promise((r) => setTimeout(r, delay));
      response = await callGemini();
    }

    if (response.status === 503) {
      return new Response(
        JSON.stringify({ error: 'The AI service is busy right now. Please try again in a minute.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Too many requests right now. Please wait a moment and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error('The AI service could not complete the request. Please try again.');
    }

    const data = await response.json();
    const aiResponse = (data?.candidates?.[0]?.content?.parts ?? []).map((p: any) => p?.text ?? "").join("");
    if (!aiResponse) throw new Error("Empty AI response");
    
    console.log('AI Response:', aiResponse);
    
    // Parse JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const guide = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify(guide),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in planting-guide function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
