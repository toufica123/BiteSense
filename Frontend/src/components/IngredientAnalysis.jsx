import IngredientCard from './IngredientCard';

const IngredientAnalysis = () => {
  const sampleData = {
    product: "Lays Sour Cream & Onion Chips",
    ingredients: [
      {
        name: "Sodium Benzoate",
        type: "preservative",
        description: "Helps prevent spoilage but may affect sensitive people. Evidence of harm is limited.",
        details: [
          {
            label: "Preservative",
            icon: "✓",
            color: "emerald",
            text: "Extends shelf life vs. minor potential sensitivity"
          },
          {
            label: "Uncertainty",
            icon: "⚠",
            color: "yellow",
            text: "Needs more research. Context-dependent."
          }
        ],
        advice: "Focus on overall diet. Consider moderation if sensitive."
      },
      {
        name: "Maltodextrin",
        type: "texture",
        description: "Boosts texture but high glycemic index can spike blood sugar.",
        details: [
          {
            label: "Improves texture and mouthfeel",
            icon: "😊",
            color: "emerald",
            text: "Improves texture and mouthfeel"
          },
          {
            label: "Trade-Offs",
            icon: "⚖",
            color: "yellow",
            text: "High glycemic index, spikes blood sugar"
          }
        ],
        advice: "Focus on overall diet. Consider moderation if sensitive."
      }
    ],
    highlights: [
      "Sodium Benzoate preserves shelf life but may irritate sensitive individuals.",
      "Maltodextrin improves texture but has a high glycemic index."
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 lg:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🥔</span>
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">
              {sampleData.product}
            </h2>
            <div className="flex flex-wrap gap-3 text-sm">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Image
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Paste ingredients...
              </button>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">AI-Powered Analysis</h3>

        <div className="space-y-4">
          {sampleData.ingredients.map((ingredient, index) => (
            <IngredientCard key={index} ingredient={ingredient} />
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💡</span>
          <h3 className="text-lg font-semibold text-white">Key Highlights</h3>
        </div>
        <div className="space-y-3">
          {sampleData.highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 mt-0.5">
                {index === 0 ? (
                  <span className="text-emerald-500 text-xl">✓</span>
                ) : (
                  <span className="text-green-500 text-xl">🌿</span>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed">
                <span className="font-semibold text-white">
                  {highlight.split(' ')[0] + ' ' + highlight.split(' ')[1]}
                </span>{' '}
                {highlight.split(' ').slice(2).join(' ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngredientAnalysis;
