// Verdict badge — color-coded result indicator (green/amber/red).

const styles = {
  good: 'bg-green-100 text-green-800 border-green-300',
  borderline: 'bg-amber-100 text-amber-800 border-amber-300',
  bad: 'bg-red-100 text-red-800 border-red-300',
} as const;

const labels = {
  good: 'Good Deal',
  borderline: 'Borderline',
  bad: 'Bad Deal',
} as const;

export function VerdictBadge({ verdict }: { verdict: 'good' | 'borderline' | 'bad' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${styles[verdict]}`}
    >
      {labels[verdict]}
    </span>
  );
}
