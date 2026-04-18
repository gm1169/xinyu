"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { format } from "date-fns";

type Record = {
  recordDate: string | Date;
  emotionScore: number;
  anxietyScore: number;
  depressionScore: number;
};

export function EmotionChart({ records }: { records: Record[] }) {
  const data = records.map((r) => ({
    date: format(new Date(r.recordDate), "MM/dd"),
    情绪: r.emotionScore,
    焦虑: r.anxietyScore,
    抑郁: r.depressionScore,
  }));

  if (data.length === 0) return null;

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#2C2C2C" strokeOpacity={0.06} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#666" }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: "#666" }}
            ticks={[0, 2, 4, 6, 8, 10]}
          />
          <Tooltip
            contentStyle={{
              background: "#FEFEFA",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="情绪"
            stroke="#6B8E6B"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="焦虑"
            stroke="#D4A84B"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="抑郁"
            stroke="#8B477C"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
