import { useState } from "react";
import type { PerformanceMetrics } from "./types/metrics";
import "./App.css";
import { ActivityMode } from "./components/ActivityMode";
import { PropsDrillingMode } from "./components/PropsDrillingMode";
import { MetricsDisplay } from "./components/MetricsDisplay";

/**
 * タブの状態を管理する型
 */
interface TabState {
  count: number;
  text: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3">("tab1");

  // Props Drillingパターンの状態
  const [tab1State, setTab1State] = useState<TabState>({ count: 0, text: "" });
  const [tab2State, setTab2State] = useState<TabState>({ count: 0, text: "" });
  const [tab3State, setTab3State] = useState<TabState>({ count: 0, text: "" });

  const [activityMetrics, setActivityMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsed: null,
  });
  const [propsDrillingMetrics, setPropsDrillingMetrics] =
    useState<PerformanceMetrics>({
      renderTime: 0,
      memoryUsed: null,
    });

  return (
    <div className="app">
      <h1>Activity vs Props Drilling（状態保持の比較）</h1>
      <p className="description">
        どちらも外見は同じですが、内部実装が異なります。
        <br />
        パフォーマンス、マウント動作、Propsの流れを観察してください。
      </p>

      <div className="tabs">
        <button
          className={activeTab === "tab1" ? "active" : ""}
          onClick={() => setActiveTab("tab1")}
        >
          Tab 1
        </button>
        <button
          className={activeTab === "tab2" ? "active" : ""}
          onClick={() => setActiveTab("tab2")}
        >
          Tab 2
        </button>
        <button
          className={activeTab === "tab3" ? "active" : ""}
          onClick={() => setActiveTab("tab3")}
        >
          Tab 3
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Activity モード */}
        <div>
          <h2>🚀 Activity モード</h2>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            React 19の新機能。状態を保持したままUIを表示/非表示。
          </p>
          <ActivityMode
            activeTab={activeTab}
            onMetricsUpdate={setActivityMetrics}
          />
          <MetricsDisplay
            mode="Activity メトリクス"
            metrics={activityMetrics}
          />
        </div>

        {/* Props Drilling パターン */}
        <div>
          <h2>📋 Props Drilling パターン</h2>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            従来の方法。各タブの状態をPropsで渡す。条件付きレンダリング。
          </p>
          <PropsDrillingMode
            activeTab={activeTab}
            tab1State={tab1State}
            tab2State={tab2State}
            tab3State={tab3State}
            onTab1StateChange={setTab1State}
            onTab2StateChange={setTab2State}
            onTab3StateChange={setTab3State}
            onMetricsUpdate={setPropsDrillingMetrics}
          />
          <MetricsDisplay
            mode="Props Drilling メトリクス"
            metrics={propsDrillingMetrics}
          />
        </div>
      </div>

      <div className="comparison-guide">
        <h2>💡 どう違うのか</h2>
        <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>項目</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Activity</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Props Drilling</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>表示/非表示制御</td>
              <td style={{ padding: "0.5rem" }}>Activity コンポーネント</td>
              <td style={{ padding: "0.5rem" }}>条件付きレンダリング</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>状態保持</td>
              <td style={{ padding: "0.5rem" }}>自動（DOMが保持される）</td>
              <td style={{ padding: "0.5rem" }}>Propsで管理（親で保持）</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>マウント</td>
              <td style={{ padding: "0.5rem" }}>初回のみ</td>
              <td style={{ padding: "0.5rem" }}>条件によってマウント/アンマウント</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>Props数</td>
              <td style={{ padding: "0.5rem" }}>少ない</td>
              <td style={{ padding: "0.5rem" }}>多い（Drilling発生）</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem" }}>実装複雑度</td>
              <td style={{ padding: "0.5rem" }}>シンプル</td>
              <td style={{ padding: "0.5rem" }}>複雑（親で全状態管理）</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
