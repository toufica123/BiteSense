const History = () => {
  const historyItems = [
    {
      id: 1,
      product: "Lays Sour Cream & Onion Chips",
      date: "2 hours ago",
      icon: "🥔"
    },
    {
      id: 2,
      product: "Organic Almond Butter",
      date: "1 day ago",
      icon: "🥜"
    },
    {
      id: 3,
      product: "Greek Yogurt",
      date: "3 days ago",
      icon: "🥛"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-950 dark:text-white transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Analysis History</h1>

        <div className="space-y-4">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {item.product}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.date}</p>
                </div>
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
