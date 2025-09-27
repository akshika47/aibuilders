const express = require('express');
const multer = require('multer');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Analyze food image endpoint
app.post('/analyze-food', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const imageDataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

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

    res.json({
      success: true,
      analysis: analysisData,
      rawResponse: analysisText
    });

  } catch (error) {
    console.error('Error analyzing food:', error);
    res.status(500).json({ 
      error: 'Failed to analyze food image',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🍽️  Food Nutrition Analyzer running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} to start analyzing food!`);
});
