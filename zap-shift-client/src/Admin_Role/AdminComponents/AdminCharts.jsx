const COLORS = ["#84cc16", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#ef4444", "#64748b"];

export const BarChart = ({ data, title }) => {
  if (!data?.length) {
    return (
      <EmptyChart title={title} />
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>
      <div className="mt-4 space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-xs font-medium text-slate-600 dark:text-slate-300">
              {item.name}
            </span>
            <div className="h-5 flex-1 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
              <div
                className="flex h-full items-center rounded-lg px-2 transition-all duration-700"
                style={{
                  width: `${Math.max((item.count / max) * 100, 4)}%`,
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              >
                <span className="text-[10px] font-bold text-white">{item.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LineChart = ({ data, title, formatValue }) => {
  if (!data?.length) {
    return <EmptyChart title={title} />;
  }

  const width = 560;
  const height = 200;
  const padX = 32;
  const padTop = 16;
  const padBottom = 28;

  const max = Math.max(...data.map((d) => d.amount), 1);
  const stepX = data.length > 1 ? (width - padX * 2) / (data.length - 1) : 0;
  const points = data.map((d, i) => ({
    x: padX + i * stepX,
    y: height - padBottom - (d.amount / max) * (height - padTop - padBottom),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - padBottom} L${points[0].x},${height - padBottom} Z`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>
      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[420px]"
          role="img"
          aria-label={title}
        >
          <defs>
            <linearGradient id="lineAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#84cc16" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#84cc16" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padX}
              x2={width - padX}
              y1={height - padBottom - ratio * (height - padTop - padBottom)}
              y2={height - padBottom - ratio * (height - padTop - padBottom)}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeDasharray="4 4"
            />
          ))}

          <path d={areaPath} fill="url(#lineAreaGradient)" />
          <path d={linePath} fill="none" stroke="#84cc16" strokeWidth="2.5" strokeLinecap="round" />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#84cc16" stroke="#fff" strokeWidth="1.5" />
              <text x={p.x} y={height - 8} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.6">
                {data[i].label}
              </text>
            </g>
          ))}

          {points.map((p, i) => (
            <text
              key={`v-${i}`}
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#16a34a"
            >
              {formatValue ? formatValue(data[i].amount) : data[i].amount}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export const DonutChart = ({ data, title }) => {
  if (!data?.length) {
    return <EmptyChart title={title} />;
  }

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  const segments = data.reduce((acc, d, i) => {
    const fraction = d.value / total;
    const dash = fraction * circumference;
    const start = acc.length ? acc[acc.length - 1].end : 0;
    acc.push({
      key: d.name,
      name: d.name,
      value: d.value,
      color: COLORS[i % COLORS.length],
      dash,
      start,
      end: start + dash,
    });
    return acc;
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>
      <div className="mt-4 flex flex-col items-center gap-4">
        <svg viewBox="0 0 160 160" className="h-40 w-40" role="img" aria-label={title}>
          <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="18" />
          {segments.map((seg) => (
            <circle
              key={seg.key}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="18"
              strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
              strokeDashoffset={-seg.start}
              strokeLinecap="butt"
              transform="rotate(-90 80 80)"
            />
          ))}
          <text x="80" y="76" textAnchor="middle" fontSize="22" fontWeight="bold" fill="currentColor">
            {total}
          </text>
          <text x="80" y="96" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.6">
            Total
          </text>
        </svg>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              {d.name} ({d.value})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EmptyChart = ({ title }) => (
  <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
    <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
    No data available yet
  </div>
);
