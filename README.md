# 🍽️ NutriVision - AI Food Nutrition Analyzer

A sleek web application that uses OpenAI's Vision API to analyze food photos and provide detailed nutritional information. Simply take a photo or upload an image of your food to get instant ingredient identification and nutritional analysis.

## ✨ Features

- 📸 **Smart Photo Analysis** - Take photos or upload images of food
- 🧠 **AI-Powered Recognition** - Uses OpenAI's Vision API to identify ingredients
- 📊 **Detailed Nutrition Facts** - Complete nutritional breakdown including calories, macros, and micronutrients
- 💡 **Health Insights** - Get personalized health recommendations and dietary considerations
- 🏥 **Health Scoring** - Visual health score rating from 1-10
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎨 **Modern UI** - Beautiful, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

### Installation

1. **Clone or download this project**
   ```bash
   cd "vibe coding bootcamp"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 How to Use

1. **Upload or Capture**: Click "Take Photo" to use your camera or "Upload Image" to select a file
2. **Preview**: Review your selected image and click "Analyze Food"
3. **Results**: View comprehensive nutritional analysis including:
   - Identified food items and portion sizes
   - Complete nutrition facts (calories, protein, carbs, fat, fiber, sugar)
   - Health score and personalized insights
   - Ingredient breakdown with nutritional benefits

## 🛠️ Technical Details

### Built With

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **AI**: OpenAI Vision API (GPT-4 Vision)
- **File Upload**: Multer
- **Styling**: Modern CSS with CSS Grid and Flexbox

### API Endpoints

- `GET /` - Serve the main application
- `POST /analyze-food` - Analyze uploaded food image
- `GET /health` - Health check endpoint

### Project Structure

```
├── server.js          # Express server and OpenAI integration
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variables template
├── public/
│   ├── index.html     # Main HTML structure
│   ├── styles.css     # Modern CSS styling
│   └── script.js      # Frontend JavaScript logic
└── README.md          # This file
```

## 🎨 Design Features

- **Gradient Backgrounds** - Beautiful color gradients for visual appeal
- **Card-Based Layout** - Clean, organized information display
- **Responsive Grid** - Adaptive layout for all screen sizes
- **Smooth Animations** - Fade-in and slide-up effects
- **Interactive Elements** - Hover effects and button animations
- **Accessibility** - Keyboard navigation and screen reader support

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 3000)

### Customization

You can customize the app by modifying:
- **Colors**: Update CSS custom properties in `styles.css`
- **Analysis Prompt**: Modify the prompt in `server.js` for different analysis focus
- **UI Layout**: Adjust the HTML structure in `index.html`

## 📱 Mobile Support

The app is fully responsive and includes:
- Touch-friendly interface
- Camera access for mobile photo capture
- Optimized layouts for small screens
- Gesture support for drag-and-drop

## 🔒 Privacy & Security

- Images are processed in memory and not stored permanently
- All communication with OpenAI API is secure (HTTPS)
- No personal data is collected or stored

## 🚀 Development

For development with auto-restart:
```bash
npm run dev
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

**Powered by OpenAI Vision API** • **Built with ❤️ for healthy eating**
