'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SessionSummary } from '@/lib/test-lab-api'

interface ScoreHistoryChartProps {
  sessions: SessionSummary[]
  locale: 'en' | 'ar'
}

export function ScoreHistoryChart({ sessions, locale }: ScoreHistoryChartProps) {
  const isRtl = locale === 'ar'

  const completed = sessions
    .filter((s) => s.score_pct !== null && s.finished_at !== null)
    .slice(0, 20)
    .reverse()

  if (completed.length < 2) {
    return (
      <div className="flex h-36 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">
        {isRtl
          ? 'أكمل جلستين على الأقل لعرض الرسم البياني'
          : 'Complete at least 2 sessions to see your progress'}
      </div>
    )
  }

  const data = completed.map((s, i) => ({
    label: `#${i + 1}`,
    score: s.score_pct ?? 0,
    exam: s.exam_type,
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: '1px solid #e2e8f0',
            fontSize: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
          formatter={(val) => [`${Number(val).toFixed(1)}%`, isRtl ? 'النتيجة' : 'Score']}
          labelFormatter={(label, payload) =>
            payload?.[0]
              ? `${label} — ${(payload[0].payload as { exam: string }).exam}`
              : label
          }
        />
        {/* 80% target band */}
        <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="4 4" strokeWidth={1.5} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#0d8be8"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#0d8be8', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#026dc6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
