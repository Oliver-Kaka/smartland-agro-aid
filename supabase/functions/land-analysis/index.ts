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
    const { country, region } = await req.json();
    console.log('Getting land analysis for:', { country, region });

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const prompt = `You are an expert in land reclamation and GIS analysis. Analyze potential land reclamation sites in ${country}${region ? ` (${region})` : ''}.

Provide 3-4 specific potential sites for land reclamation with realistic data. Include both dam construction sites and swamp reclamation areas where applicable.

For each site, provide:
- name: Specific geographic name
- type: "Dam Construction" or "Swamp Reclamation" or "Irrigation Project"
- area: Size in hectares
- coordinates: {lat: number, lng: number}
- suitability: percentage (70-95)
- description: Detailed technical description including geological features

Also provide AI recommendations for:
- Priority site and reasoning
- Environmental impact considerations
- Community engagement strategies

Return your response in this exact JSON format:
{
  "potentialSites": [
    {
      "id": 1,
      "name": "Site name",
      "type": "Type",
      "area": "X hectares",
      "coordinates": {"lat": 0.0, "lng": 0.0},
      "suitability": 90,
      "description": "Description"
    }
  ],
  "recommendations": {
    "priority": "Priority site recommendation",
    "environmental": "Environmental considerations",
    "community": "Community engagement advice"
  }
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`, {
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
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
    
    const analysis = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in land-analysis function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
