import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

interface MetricsChartProps {
  before: number;
  after: number;
  label: string;
}

const MetricsChart = ({ before, after, label }: MetricsChartProps) => {
  const data = [
    { name: "До", value: before },
    { name: "После", value: after },
  ];

  return (
    <div className="w-full">
      <p className="text-xs text-muted-foreground mb-2 text-center">{label}</p>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }}
            />
            <YAxis hide domain={[0, 100]} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              <Cell fill="hsl(215, 15%, 80%)" />
              <Cell fill="hsl(217, 91%, 60%)" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span className="text-muted-foreground">{before}%</span>
        <span className="font-semibold text-primary">{after}%</span>
      </div>
    </div>
  );
};

export default MetricsChart;
