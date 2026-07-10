'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';

import type { CategoryScore } from '@/lib/scoring/engine';

interface ScoreRadarChartProps {
  categoryScores: CategoryScore[];
  categoryLabels: Record<string, string>;
}

export function ScoreRadarChart({ categoryScores, categoryLabels }: ScoreRadarChartProps) {
  const data = categoryScores.map(({ categoryId, score }) => ({
    category: categoryLabels[categoryId] ?? categoryId,
    score,
  }));

  return (
    <div className="h-80 w-full [--radar-line:#2a78d6] [--radar-tick:#898781] dark:[--radar-line:#3987e5]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="rgba(137,135,129,0.35)" />
          <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--radar-tick)', fontSize: 11 }} />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{ fill: 'var(--radar-tick)', fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            dataKey="score"
            stroke="var(--radar-line)"
            strokeWidth={2}
            fill="var(--radar-line)"
            fillOpacity={0.2}
            dot={{ r: 4, fill: 'var(--radar-line)', stroke: 'none' }}
          />
          <Tooltip
            formatter={(value?: ValueType) => [`${value}/100`, 'Score']}
            contentStyle={{ fontSize: 12 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
