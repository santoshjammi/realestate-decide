// Results panel — renders a labeled metric row.

interface MetricRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function MetricRow({ label, value, highlight }: MetricRowProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3 py-2 ${
        highlight ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-gray-50 dark:bg-gray-800/50'
      }`}
    >
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>
        {value}
      </span>
    </div>
  );
}

export function ResultsPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {children}
    </div>
  );
}
