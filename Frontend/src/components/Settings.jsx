import {useTheme} from '../context/ThemeContext.jsx';
const Settings = () => {
  const {darkMode, setDarkMode} = useTheme();
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-950 dark:text-white transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Show detailed analysis</p>
                  <p className="text-gray-500 text-sm">Display comprehensive ingredient breakdown</p>
                </div>
                <button className="w-12 h-6 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Highlight allergens</p>
                  <p className="text-gray-500 text-sm">Automatically detect common allergens</p>
                </div>
                <button className="w-12 h-6 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Save history</p>
                  <p className="text-gray-500 text-sm">Keep a record of analyzed products</p>
                </div>
                <button className="w-12 h-6 bg-gray-700 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Enable Dark Mode</p>
                  <p className="text-gray-500 text-sm">Switch between light and dark themes</p>
                </div>
                <button className="w-12 h-6 bg-emerald-500 rounded-full relative" onClick={()=> setDarkMode(!darkMode)}>
                  <div className={`absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">About</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Ingredient Co-Pilot v1.0.0</p>
              <p>AI-powered food ingredient analysis</p>
              <p className="pt-4">
                <button className="text-emerald-500 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </button>
                {' · '}
                <button className="text-emerald-500 hover:text-emerald-400 transition-colors">
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
