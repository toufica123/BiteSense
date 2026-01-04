const fs = require('fs');
const path = require('path');

// Mock ingredient data with realistic food label ingredients
const MOCK_INGREDIENTS = [
  {
    text: "Water, Sugar, High Fructose Corn Syrup, Natural Flavors, Citric Acid, Sodium Benzoate (Preservative), Potassium Sorbate (Preservative), Red 40, Blue 1",
    category: "beverage"
  },
  {
    text: "Enriched Flour (Wheat Flour, Niacin, Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Sugar, Vegetable Oil (Palm, Soybean), Cocoa Powder, Salt, Baking Soda, Natural Vanilla Flavor",
    category: "baked_goods"
  },
  {
    text: "Organic Tomatoes, Organic Tomato Puree, Sea Salt, Organic Basil, Organic Garlic, Organic Onion Powder, Organic Black Pepper",
    category: "sauce"
  },
  {
    text: "Milk, Cream, Sugar, Egg Yolks, Natural Vanilla Extract, Carrageenan, Guar Gum",
    category: "dairy"
  },
  {
    text: "Whole Grain Oats, Sugar, Salt, Natural Flavor, Vitamin E (Mixed Tocopherols), Iron, Vitamin A Palmitate, Vitamin B6, Vitamin B1, Folic Acid, Vitamin B12, Vitamin D3",
    category: "cereal"
  },
  {
    text: "Chicken, Water, Salt, Sodium Phosphate, Natural Flavor",
    category: "meat"
  },
  {
    text: "Peanuts, Salt, Sugar, Peanut Oil, Molasses",
    category: "snack"
  }
];

/**
 * Extract text from image using OCR (mock implementation)
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<string>} - Extracted ingredient text
 */
async function extractTextFromImage(imagePath) {
  try {
    console.log('Starting OCR extraction for:', imagePath);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.error('Image file not found:', imagePath);
      return getMockIngredients();
    }

    // Simulate OCR processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    // For now, return mock ingredients
    // TODO: Replace with actual OCR implementation (Tesseract.js, Google Vision API, etc.)
    const mockData = getMockIngredients();
    console.log('OCR extraction completed (mock):', mockData);
    
    return mockData;

  } catch (error) {
    console.error('OCR extraction failed:', error);
    return getMockIngredients();
  }
}

/**
 * Get mock ingredients for testing/fallback
 * @returns {string} - Mock ingredient list
 */
function getMockIngredients() {
  const randomIndex = Math.floor(Math.random() * MOCK_INGREDIENTS.length);
  return MOCK_INGREDIENTS[randomIndex].text;
}

/**
 * Analyze ingredients and provide insights
 * @param {string} ingredientText - Extracted ingredient text
 * @returns {object} - Analysis results
 */
function analyzeIngredients(ingredientText) {
  const ingredients = ingredientText.split(',').map(i => i.trim());
  
  // Common allergens
  const allergens = [];
  const allergenKeywords = {
    'gluten': ['wheat', 'flour', 'barley', 'rye'],
    'dairy': ['milk', 'cream', 'cheese', 'butter', 'lactose'],
    'nuts': ['peanut', 'almond', 'walnut', 'cashew', 'pecan'],
    'soy': ['soy', 'soybean', 'lecithin'],
    'eggs': ['egg', 'albumin']
  };

  for (const [allergen, keywords] of Object.entries(allergenKeywords)) {
    if (keywords.some(keyword => 
      ingredientText.toLowerCase().includes(keyword.toLowerCase())
    )) {
      allergens.push(allergen);
    }
  }

  // Additives and preservatives
  const additives = [];
  const additiveKeywords = [
    'sodium benzoate', 'potassium sorbate', 'bht', 'bha', 
    'msg', 'high fructose corn syrup', 'artificial', 'red 40', 
    'blue 1', 'yellow 5', 'carrageenan', 'sodium phosphate'
  ];

  additiveKeywords.forEach(additive => {
    if (ingredientText.toLowerCase().includes(additive.toLowerCase())) {
      additives.push(additive);
    }
  });

  return {
    totalIngredients: ingredients.length,
    allergens,
    additives,
    isOrganic: ingredientText.toLowerCase().includes('organic'),
    hasArtificialColors: additives.some(a => a.includes('red') || a.includes('blue') || a.includes('yellow')),
    hasPreservatives: additives.some(a => a.includes('benzoate') || a.includes('sorbate')),
    hasHighFructoseCornSyrup: ingredientText.toLowerCase().includes('high fructose corn syrup')
  };
}

module.exports = {
  extractTextFromImage,
  analyzeIngredients,
  getMockIngredients
};