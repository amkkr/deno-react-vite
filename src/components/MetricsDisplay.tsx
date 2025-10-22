import type { PerformanceMetrics } from "../types/metrics";

/**
 * パフォーマンスメトリクス表示コンポーネント
 */
export const MetricsDisplay = ({
  mode,
  metrics,
}: {
  mode: string;
  metrics: PerformanceMetrics;
}) => {
  return (
    <div className="metrics">
      <h3>{mode}</h3>
      <div className="metrics-grid">
        <div className="metric-item">
          <span className="metric-label">切り替え時間:</span>
          <span className="metric-value">{metrics.renderTime.toFixed(2)}ms</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">メモリ使用量:</span>
          <span className="metric-value">
            {metrics.memoryUsed !== null
              ? `${(metrics.memoryUsed / 1024 / 1024).toFixed(2)} MB`
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};
