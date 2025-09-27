class FoodAnalyzer {
    constructor() {
        this.currentImage = null;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Sections
        this.uploadSection = document.getElementById('uploadSection');
        this.previewSection = document.getElementById('previewSection');
        this.loadingSection = document.getElementById('loadingSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.errorSection = document.getElementById('errorSection');

        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.cameraInput = document.getElementById('cameraInput');
        this.cameraBtn = document.getElementById('cameraBtn');
        this.uploadBtn = document.getElementById('uploadBtn');

        // Preview elements
        this.previewImage = document.getElementById('previewImage');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.retakeBtn = document.getElementById('retakeBtn');

        // Action buttons
        this.newAnalysisBtn = document.getElementById('newAnalysisBtn');
        this.retryBtn = document.getElementById('retryBtn');

        // Result elements
        this.foodItemsList = document.getElementById('foodItemsList');
        this.portionSize = document.getElementById('portionSize');
        this.healthScore = document.getElementById('healthScore');
        this.scoreValue = document.getElementById('scoreValue');
        this.calories = document.getElementById('calories');
        this.protein = document.getElementById('protein');
        this.carbs = document.getElementById('carbs');
        this.fat = document.getElementById('fat');
        this.fiber = document.getElementById('fiber');
        this.sugar = document.getElementById('sugar');
        this.healthInsights = document.getElementById('healthInsights');
        this.ingredientsList = document.getElementById('ingredientsList');
        this.errorMessage = document.getElementById('errorMessage');
    }

    bindEvents() {
        // Upload button events
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.cameraBtn.addEventListener('click', () => this.cameraInput.click());
        
        // File input events
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.cameraInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.uploadArea.addEventListener('click', () => this.fileInput.click());

        // Action button events
        this.analyzeBtn.addEventListener('click', () => this.analyzeFood());
        this.retakeBtn.addEventListener('click', () => this.resetToUpload());
        this.newAnalysisBtn.addEventListener('click', () => this.resetToUpload());
        this.retryBtn.addEventListener('click', () => this.analyzeFood());

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.resetToUpload();
            }
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File size must be less than 10MB.');
            return;
        }

        // Read and display the image
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = file;
            this.previewImage.src = e.target.result;
            this.showPreview();
        };
        reader.readAsDataURL(file);
    }

    showSection(section) {
        // Hide all sections
        [this.uploadSection, this.previewSection, this.loadingSection, 
         this.resultsSection, this.errorSection].forEach(s => {
            s.style.display = 'none';
        });
        
        // Show target section
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }

    showPreview() {
        this.showSection(this.previewSection);
        this.previewSection.classList.add('fade-in');
    }

    showLoading() {
        this.showSection(this.loadingSection);
        this.loadingSection.classList.add('fade-in');
    }

    showResults(data) {
        this.displayResults(data);
        this.showSection(this.resultsSection);
        this.resultsSection.classList.add('slide-up');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.showSection(this.errorSection);
        this.errorSection.classList.add('fade-in');
    }

    resetToUpload() {
        this.currentImage = null;
        this.fileInput.value = '';
        this.cameraInput.value = '';
        this.showSection(this.uploadSection);
        this.uploadSection.classList.add('fade-in');
    }

    async analyzeFood() {
        if (!this.currentImage) {
            this.showError('No image selected for analysis.');
            return;
        }

        this.showLoading();

        try {
            const formData = new FormData();
            formData.append('image', this.currentImage);

            const response = await fetch('/analyze-food', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                this.showResults(result.analysis);
            } else {
                throw new Error(result.error || 'Analysis failed');
            }

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError(
                error.message || 'Failed to analyze the image. Please try again.'
            );
        }
    }

    displayResults(data) {
        // Display food items
        this.displayFoodItems(data.foodItems || []);
        
        // Display portion size
        this.portionSize.textContent = data.portionSize || 'Not specified';
        
        // Display health score
        this.displayHealthScore(data.healthScore || 5);
        
        // Display nutrition facts
        this.displayNutrition(data.nutrition || {});
        
        // Display health insights
        this.displayHealthInsights(data.healthInsights || []);
        
        // Display ingredients
        this.displayIngredients(data.ingredients || []);
    }

    displayFoodItems(items) {
        this.foodItemsList.innerHTML = '';
        
        if (items.length === 0) {
            this.foodItemsList.innerHTML = '<p class="text-secondary">No food items identified</p>';
            return;
        }

        items.forEach(item => {
            const itemElement = document.createElement('span');
            itemElement.className = 'food-item';
            itemElement.textContent = item;
            this.foodItemsList.appendChild(itemElement);
        });
    }

    displayHealthScore(score) {
        this.scoreValue.textContent = score;
        
        // Update score circle color based on value
        this.healthScore.className = 'score-circle';
        if (score >= 7) {
            this.healthScore.classList.add('high');
        } else if (score >= 4) {
            this.healthScore.classList.add('medium');
        } else {
            this.healthScore.classList.add('low');
        }
    }

    displayNutrition(nutrition) {
        // Update nutrition values
        this.calories.textContent = Math.round(nutrition.calories || 0);
        this.protein.textContent = (nutrition.protein || 0).toFixed(1);
        this.carbs.textContent = (nutrition.carbs || 0).toFixed(1);
        this.fat.textContent = (nutrition.fat || 0).toFixed(1);
        this.fiber.textContent = (nutrition.fiber || 0).toFixed(1);
        this.sugar.textContent = (nutrition.sugar || 0).toFixed(1);

        // Add animation to nutrition items
        const nutritionItems = document.querySelectorAll('.nutrition-item');
        nutritionItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'fadeInUp 0.5s ease forwards';
            }, index * 100);
        });
    }

    displayHealthInsights(insights) {
        this.healthInsights.innerHTML = '';
        
        if (insights.length === 0) {
            this.healthInsights.innerHTML = '<p class="text-secondary">No health insights available</p>';
            return;
        }

        insights.forEach(insight => {
            const insightElement = document.createElement('div');
            insightElement.className = 'insight-item';
            insightElement.innerHTML = `
                <i class="fas fa-lightbulb"></i>
                <div class="insight-text">${insight}</div>
            `;
            this.healthInsights.appendChild(insightElement);
        });
    }

    displayIngredients(ingredients) {
        this.ingredientsList.innerHTML = '';
        
        if (ingredients.length === 0) {
            this.ingredientsList.innerHTML = '<p class="text-secondary">No ingredient information available</p>';
            return;
        }

        ingredients.forEach(ingredient => {
            const ingredientElement = document.createElement('div');
            ingredientElement.className = 'ingredient-item';
            ingredientElement.innerHTML = `
                <div class="ingredient-name">${ingredient.name}</div>
                <div class="ingredient-benefits">${ingredient.benefits}</div>
            `;
            this.ingredientsList.appendChild(ingredientElement);
        });
    }
}

// Utility functions
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    return num.toFixed(1);
}

function getHealthScoreColor(score) {
    if (score >= 7) return 'var(--accent-color)';
    if (score >= 4) return 'var(--warning-color)';
    return 'var(--danger-color)';
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new FoodAnalyzer();
    
    // Add some visual feedback for better UX
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + U for upload
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            document.getElementById('fileInput').click();
        }
        
        // Ctrl/Cmd + Enter to analyze
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const analyzeBtn = document.getElementById('analyzeBtn');
            if (analyzeBtn.style.display !== 'none') {
                analyzeBtn.click();
            }
        }
    });

    console.log('🍽️ Food Nutrition Analyzer initialized successfully!');
});
