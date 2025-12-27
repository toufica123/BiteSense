const IngredientCard = ({ ingredient }) => {
  const getIconColorClass = (color) => {
    const colors = {
      emerald: 'text-emerald-500 bg-emerald-500/10',
      yellow: 'text-yellow-500 bg-yellow-500/10',
      red: 'text-red-500 bg-red-500/10'
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 lg:p-6">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
          <span className="text-emerald-500 text-lg">✓</span>
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white mb-1">{ingredient.name}</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            {ingredient.description}
          </p>
        </div>
      </div>

      <div className="space-y-3 ml-11">
        {ingredient.details.map((detail, index) => (
          <div
            key={index}
            className="bg-gray-900/50 rounded-lg border border-gray-700/50 p-4"
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${getIconColorClass(detail.color)}`}>
                <span className="text-sm">{detail.icon}</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-white text-sm mb-1">{detail.label}</div>
                <p className="text-gray-400 text-sm">{detail.text}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-2 pt-2">
          <div className="flex-shrink-0 w-4 h-4 mt-0.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
          <p className="text-gray-400 text-sm">
            {ingredient.advice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IngredientCard;
