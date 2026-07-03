import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

export default function RecoveryTrend({ data }) {
  const points = data || [];
  return (
    <div className="card">
      <div className="eyebrow">Recuperação · últimos dias</div>
      <div style={{ height: 220, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="recFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#35e0a1" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#35e0a1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <ReferenceLine y={50} stroke="#3a4658" strokeDasharray="3 3" />
            <ReferenceLine y={75} stroke="#3a4658" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#5c6675"
              tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#5c6675"
              tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#141922",
                border: "1px solid #232b38",
                borderRadius: 12,
                fontFamily: "JetBrains Mono",
                fontSize: 12,
              }}
              labelStyle={{ color: "#8a96a8" }}
              itemStyle={{ color: "#35e0a1" }}
              formatter={(val) => [`${val}%`, "Recuperação"]}
            />
            <Area
              type="monotone"
              dataKey="recovery"
              stroke="#35e0a1"
              strokeWidth={2}
              fill="url(#recFill)"
              dot={{ r: 2.5, fill: "#35e0a1" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
