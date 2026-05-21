'use client'

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { WeakTopic } from '@/lib/test-lab-api'

interface WeakTopicsChartProps {
  topics: WeakTopic[]
  locale: 'en' | 'ar'
}

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16']

export function WeakTopicsChart({ topics, locale }: WeakTopicsChartProps) {
  const isRtl = locale === 'ar'

  if (topics.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">
        {isRtl ? 'لا توجد بيانات بعد — أكمل جلسة للبدء' : 'No data yet — complete a session to start'}
      </div>
    )
  }

  const data = topics
    .slice(0, 8)
    .map((t) => ({ topic: t.topic, misses: t.miss_count }))
    .reverse()

  return (
    <ResponsiveContainer width="100%" height={Math.max(140, data.length * 36)}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
      >
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="topic"
          width={120}
          tick={{ fontSize: 12, fill: '#475569' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{
            borderRadius: 10,
            border: '1px solid #e2e8f0',
            fontSize: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
          formatter={(val) => [Number(val), isRtl ? 'أخطاء' : 'misses']}
        />
        <Bar dataKey="misses" radius={[0, 6, 6, 0]} maxBarSize={24}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[Math.min(i, COLORS.length - 1)]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
