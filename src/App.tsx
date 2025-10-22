import { useState, Activity, useEffect, useRef } from "react";
import "./App.css";

/**
 * パフォーマンスメトリクスの型定義
 */
interface PerformanceMetrics {
  renderTime: number;
  memoryUsed: number | null;
}

/**
 * タブコンテンツコンポーネント
 * 各タブはカウンターとテキスト入力を持つ
 */
const TabContent = ({ name }: { name: string }) => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  return (
    <div className="tab-content">
      <h2>{name}</h2>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>
        <p>カウンター: {count}</p>
      </div>
      <div className="card">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="テキストを入力..."
          className="text-input"
        />
        <p>入力内容: {text || "(空)"}</p>
      </div>
    </div>
  );
};

/**
 * Activityを使った実装
 */
const ActivityMode = ({
  activeTab,
  onMetricsUpdate,
}: {
  activeTab: "tab1" | "tab2" | "tab3";
  onMetricsUpdate: (metrics: PerformanceMetrics) => void;
}) => {
  const switchStartTime = useRef(performance.now());

  const handleTabSwitch = () => {
    const renderTime = performance.now() - switchStartTime.current;
    const memoryUsed =
      (performance as unknown as { memory?: { usedJSHeapSize: number } })
        .memory?.usedJSHeapSize || null;

    onMetricsUpdate({
      renderTime,
      memoryUsed,
    });
    switchStartTime.current = performance.now();
  };

  useEffect(() => {
    handleTabSwitch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <>
      <Activity mode={activeTab === "tab1" ? "visible" : "hidden"}>
        <TabContent name="Tab 1 Content" />
      </Activity>

      <Activity mode={activeTab === "tab2" ? "visible" : "hidden"}>
        <TabContent name="Tab 2 Content" />
      </Activity>

      <Activity mode={activeTab === "tab3" ? "visible" : "hidden"}>
        <TabContent name="Tab 3 Content" />
      </Activity>
    </>
  );
};

/**
 * 従来の条件付きレンダリング実装
 * 条件によってコンポーネントがマウント/アンマウントされる
 */
const ConditionalMode = ({
  activeTab,
  onMetricsUpdate,
}: {
  activeTab: "tab1" | "tab2" | "tab3";
  onMetricsUpdate: (metrics: PerformanceMetrics) => void;
}) => {
  const switchStartTime = useRef(performance.now());

  const handleTabSwitch = () => {
    const renderTime = performance.now() - switchStartTime.current;
    const memoryUsed =
      (performance as unknown as { memory?: { usedJSHeapSize: number } })
        .memory?.usedJSHeapSize || null;

    onMetricsUpdate({
      renderTime,
      memoryUsed,
    });
    switchStartTime.current = performance.now();
  };

  useEffect(() => {
    handleTabSwitch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <>
      {activeTab === "tab1" && <TabContent name="Tab 1 Content" />}
      {activeTab === "tab2" && <TabContent name="Tab 2 Content" />}
      {activeTab === "tab3" && <TabContent name="Tab 3 Content" />}
    </>
  );
};

/**
 * パフォーマンスメトリクス表示コンポーネント
 */
const MetricsDisplay = ({
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

function App() {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3">("tab1");
  const [renderMode, setRenderMode] = useState<"activity" | "conditional">(
    "activity"
  );
  const [activityMetrics, setActivityMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsed: null,
  });
  const [conditionalMetrics, setConditionalMetrics] =
    useState<PerformanceMetrics>({
      renderTime: 0,
      memoryUsed: null,
    });

  return (
    <div className="app">
      <h1>React 19.2 &lt;Activity /&gt; デモ</h1>
      <p className="description">
        Activityコンポーネントは、状態を保持したままUIを表示/非表示できる新機能です。
        <br />
        タブを切り替えて、従来の条件付きレンダリングとの違いを体験してください。
      </p>

      <div className="mode-selector">
        <button
          className={renderMode === "activity" ? "active" : ""}
          onClick={() => setRenderMode("activity")}
        >
          🚀 Activity モード
        </button>
        <button
          className={renderMode === "conditional" ? "active" : ""}
          onClick={() => setRenderMode("conditional")}
        >
          📦 条件付きレンダリング
        </button>
      </div>

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

      {renderMode === "activity" ? (
        <ActivityMode
          activeTab={activeTab}
          onMetricsUpdate={setActivityMetrics}
        />
      ) : (
        <ConditionalMode
          activeTab={activeTab}
          onMetricsUpdate={setConditionalMetrics}
        />
      )}

      <div className="metrics-container">
        <MetricsDisplay
          mode="🚀 Activity モード"
          metrics={activityMetrics}
        />
        <MetricsDisplay
          mode="📦 条件付きレンダリング"
          metrics={conditionalMetrics}
        />
      </div>

      <div className="info">
        <h3>💡 Activityのメリット・デメリット</h3>
        <div className="comparison">
          <div className="comparison-item">
            <h4>✅ メリット</h4>
            <ul>
              <li><strong>状態の保持</strong>: hiddenでもコンポーネント状態が保持される（カウンターや入力内容が消えない）</li>
              <li><strong>高速な切り替え</strong>: DOMを破棄せず表示/非表示を切り替えるだけなので、切り替えが高速</li>
              <li><strong>UX向上</strong>: 戻るナビゲーション時に入力内容やスクロール位置が保持される</li>
              <li><strong>事前レンダリング</strong>: 次に表示する可能性のあるページを背景で準備できる</li>
            </ul>
          </div>
          <div className="comparison-item">
            <h4>⚠️ デメリット</h4>
            <ul>
              <li><strong>メモリ使用量増加</strong>: 全タブのDOMと状態を保持するため、メモリ消費が増える</li>
              <li><strong>初回レンダリングコスト</strong>: 全タブが最初からレンダリングされるため、初期表示が重くなる可能性</li>
              <li><strong>使いどころの見極め</strong>: 常に使うべきではなく、状態保持が必要な場合にのみ使う</li>
            </ul>
          </div>
        </div>
        <div className="comparison-note">
          <p>
            💡 <strong>使い分けのポイント</strong>:
            ユーザーが頻繁に行き来するタブや、入力フォームなど状態を保持したい場合は<code>&lt;Activity /&gt;</code>が有効。
            一方、一度きりの表示や大量のデータを扱う場合は、従来の条件付きレンダリングの方がメモリ効率が良い。
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
