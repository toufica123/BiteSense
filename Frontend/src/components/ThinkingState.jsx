const steps = [
  "Reading label…",
  "Interpreting ingredients…",
  "Explaining trade-offs…"
];

const ThinkingState = ({ step }) => {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl
      bg-emerald-500/10 border border-emerald-500/30">
      
      {/* Spinner */}
      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />

      {/* Text */}
      <p className="text-emerald-600 dark:text-emerald-400 font-medium">
        {steps[step]}
      </p>
    </div>
  );
};

export default ThinkingState;