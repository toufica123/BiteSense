import { useContext, useState } from 'react';
import ThemeContext from '../context/ThemeContext';

const Settings = () => {
  const { isDark } = useContext(ThemeContext);
  const [detailedAnalysis, setDetailedAnalysis] = useState(true);
  const [highlightAllergens, setHighlightAllergens] = useState(true);
  const [saveHistory, setSaveHistory] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Show detailed analysis</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Display comprehensive ingredient breakdown</p>
                </div>
                <button
                  onClick={() => setDetailedAnalysis(!detailedAnalysis)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    detailedAnalysis ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    detailedAnalysis ? 'right-1' : 'left-1'
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Highlight allergens</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Automatically detect common allergens</p>
                </div>
                <button
                  onClick={() => setHighlightAllergens(!highlightAllergens)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    highlightAllergens ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    highlightAllergens ? 'right-1' : 'left-1'
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Save history</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Keep a record of analyzed products</p>
                </div>
                <button
                  onClick={() => setSaveHistory(!saveHistory)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    saveHistory ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    saveHistory ? 'right-1' : 'left-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Theme</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Choose your preferred theme</p>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <p>BiteSense v1.0.0</p>
              <p>AI-powered food ingredient analysis</p>
              <p className="pt-4">
                <button className="text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </button>
                {' · '}
                <button className="text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Terms of Service
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
