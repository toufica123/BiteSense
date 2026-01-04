import { useState } from 'react';
import { uploadLabelImage, getSessionId } from '../services/api';
import ChatInterface from './ChatInterface';
import ThinkingState from './ThinkingState';

const Dashboard = () => {
  const [ingredientText, setIngredientText] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleAnalyze = () => {
    if (!ingredientText.trim()) return;

    setIsThinking(true);
    setThinkingStep(0);

    setTimeout(() => setThinkingStep(1), 900);
    setTimeout(() => setThinkingStep(2), 1800);

    setTimeout(() => {
      setIsThinking(false);
      setShowChat(true);
    }, 2600);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError(null);
    setIsThinking(true);
    setThinkingStep(0);

    try {
      setTimeout(() => setThinkingStep(1), 500);

      // Upload to backend
      const response = await uploadLabelImage(file);
      console.log("Upload response:", response);

      setUploadedFile({
        name: response.originalName,
        sessionId: response.sessionId
      });

      setTimeout(() => setThinkingStep(2), 300);

      setTimeout(() => {
        setIsThinking(false);
        setShowChat(true);
      }, 800);

    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message);
      setIsThinking(false);
    }
  };

  const handleNewScan = () => {
    setShowChat(false);
    setUploadedFile(null);
    setIngredientText('');
    setUploadError(null);
    // Reset the session to start fresh
    resetSession();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent leading-snug py-2">
            Sense Every Bite
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your AI-powered assistant for understanding food ingredients.
          </p>
        </div>

        {!showChat && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 lg:p-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Upload food label or paste ingredients..."
                value={ingredientText}
                onChange={(e) => setIngredientText(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleAnalyze}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Analyze
              </button>
            </div>

            {uploadError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                {uploadError}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
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
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">Upload Image</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Click to upload a food label image</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {isThinking && (
          <div className="mb-6">
            <ThinkingState step={thinkingStep} />
          </div>
        )}

        {showChat && (
          <div className="space-y-4">
            {uploadedFile && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📷</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Image uploaded successfully</p>
                  </div>
                </div>
                <button
                  onClick={handleNewScan}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium"
                >
                  Scan New Label
                </button>
              </div>
            )}
            <ChatInterface sessionId={uploadedFile?.sessionId || getSessionId()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
