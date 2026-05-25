import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import type { DimensionScore } from '../../api/types';

const LABELS: Record<string, string> = {
  technical: 'Technical',
  problem_solving: 'Problem solving',
  'problem solving': 'Problem solving',
  code_quality: 'Code quality',
  'code quality': 'Code quality',
  communication: 'Communication',
};

export function DimensionRadar({
  scores,
  size = 160,
  className = '',
}: {
  scores: DimensionScore[];
  size?: number;
  className?: string;
}) {
  const data = scores.map((s) => ({
    subject: LABELS[s.dimension.toLowerCase()] ?? s.dimension,
    score: s.score,
    fullMark: 100,
  }));

  if (!data.length) return null;

  return (
    <div className={className} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 9, fill: '#64748b' }}
          />
          <Radar
            dataKey="score"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
