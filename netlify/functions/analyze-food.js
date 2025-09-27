const OpenAI = require('openai');
const multipart = require('parse-multipart-data');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the multipart form data
    const boundary = event.headers['content-type'].split('boundary=')[1];
    const parts = multipart.parse(Buffer.from(event.body, 'base64'), boundary);
    
    const imagePart = parts.find(part => part.name === 'image');
    if (!imagePart) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No image file provided' }),
      };
    }

    // Convert buffer to base64
    const base64Image = imagePart.data.toString('base64');
    const mimeType = imagePart.type || 'image/jpeg';
    const imageDataUrl = `data:${mimeType};base64,${base64Image}`;

    // Create a detailed prompt for food analysis
    const prompt = `Analyze this food image and provide a comprehensive breakdown:

1. FOOD IDENTIFICATION:
   - Identify all visible food items and ingredients
   - Estimate portion sizes

2. NUTRITIONAL ANALYSIS (per serving):
   - Calories
   - Protein (g)
   - Carbohydrates (g)
   - Fat (g)
   - Fiber (g)
   - Sugar (g)
   - Sodium (mg)

3. HEALTH INSIGHTS:
   - Health score (1-10, where 10 is very healthy)
   - Key nutritional benefits
   - Potential dietary considerations

4. INGREDIENT BREAKDOWN:
   - List main ingredients detected
   - Notable nutrients from each ingredient

Please format your response as a JSON object with the following structure:
{
  "foodItems": ["item1", "item2"],
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number,
    "sodium": number
  },
  "healthScore": number,
  "healthInsights": ["insight1", "insight2"],
  "ingredients": [
    {"name": "ingredient", "benefits": "nutritional benefits"}
  ],
  "portionSize": "estimated portion description"
}`;

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    const analysisText = response.choices[0].message.content;
    
    // Try to parse JSON from the response
    let analysisData;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      analysisData = {
        foodItems: ["Food items detected"],
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0
        },
        healthScore: 5,
        healthInsights: [analysisText.substring(0, 200) + "..."],
        ingredients: [],
        portionSize: "Unable to determine"
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        analysis: analysisData,
        rawResponse: analysisText
      }),
    };

  } catch (error) {
    console.error('Error analyzing food:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to analyze food image',
        details: error.message 
      }),
    };
  }
};
