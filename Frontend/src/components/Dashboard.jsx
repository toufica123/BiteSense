import { useState } from 'react';
import IngredientAnalysis from './IngredientAnalysis';

const Dashboard = () => {
  const [ingredientText, setIngredientText] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = () => {
    if (ingredientText.trim()) {
      setShowAnalysis(true);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShowAnalysis(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-950 dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-snug mb-4 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            Sense Every Bite
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Your AI-powered assistant for understanding food ingredients.
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Upload food label or paste ingredients..."
              value={ingredientText}
              onChange={(e) => setIngredientText(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleAnalyze}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Analyze
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Upload Image</p>
                <p className="text-gray-500 text-sm">Click to upload a food label image</p>
              </div>
            </label>
          </div>
        </div>

        {showAnalysis && <IngredientAnalysis />}
      </div>
    </div>
  );
};

export default Dashboard;
