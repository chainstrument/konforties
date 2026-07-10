'use client';

import { useEffect, useState } from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import { categories, criteria } from '@/data/criteria';
import { computeScore } from '@/lib/scoring/engine';
import type { Evaluation } from '@/types/scoring';

interface ScoreComparisonRadarChartProps {
  evaluations: Evaluation[];
}

// Palette catégorielle validée (voir dataviz skill), ordre fixe.
const SERIES_COLORS: { light: string; dark: string }[] = [
  { light: '#2a78d6', dark: '#3987e5' }, // blue
  { light: '#1baf7a', dark: '#199e70' }, // aqua
  { light: '#eda100', dark: '#c98500' }, // yellow
  { light: '#008300', dark: '#008300' }, // green
  { light: '#4a3aa7', dark: '#9085e9' }, // violet
  { light: '#e34948', dark: '#e66767' }, // red
  { light: '#e87ba4', dark: '#d55181' }, // magenta
  { light: '#eb6834', dark: '#d95926' }, // orange
];

function usePrefersDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(query.matches);
    const listener = (event: MediaQueryListEvent) => setIsDark(event.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  return isDark;
}

export function ScoreComparisonRadarChart({ evaluations }: ScoreComparisonRadarChartProps) {
  const isDark = usePrefersDarkMode();
  const mode = isDark ? 'dark' : 'light';

  const evaluationScores = evaluations.map((evaluation) => ({
    evaluation,
    categoryScores: computeScore(evaluation.answers, criteria, categories).categoryScores,
  }));

  const data = categories.map((category) => {
    const row: Record<string, string | number> = { category: category.label };
    evaluationScores.forEach(({ evaluation, categoryScores }) => {
      row[evaluation.id] = categoryScores.find((c) => c.categoryId === category.id)?.score ?? 0;
    });
    return row;
  });

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="65%">
          <PolarGrid stroke="rgba(137,135,129,0.35)" />
          <PolarAngleAxis dataKey="category" tick={{ fill: '#898781', fontSize: 11 }} />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{ fill: '#898781', fontSize: 10 }}
            axisLine={false}
          />
          {evaluations.map((evaluation, index) => {
            const color = SERIES_COLORS[index % SERIES_COLORS.length][mode];
            return (
              <Radar
                key={evaluation.id}
                name={evaluation.name}
                dataKey={evaluation.id}
                stroke={color}
                strokeWidth={2}
                fill={color}
                fillOpacity={0.15}
                dot={{ r: 4, fill: color, stroke: 'none' }}
              />
            );
          })}
          <Legend />
          <Tooltip
            formatter={(value?: ValueType, name?: NameType) => [`${value}/100`, name]}
            contentStyle={{ fontSize: 12 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
