import { useState, Activity, useEffect, useRef } from "react";
import "./App.css";

/**
 * パフォーマンスメトリクスの型定義
 */
interface PerformanceMetrics {
  renderTime: number;
  memoryUsed: number | null;
  mountCount: number;
  unmountCount: number;
}

/**
 * タブコンテンツコンポーネント
 * 各タブはカウンターとテキスト入力を持つ
 */
const TabContent = ({
  name,
  onMount,
  onUnmount,
}: {
  name: string;
  onMount?: () => void;
  onUnmount?: () => void;
}) => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const renderStartTime = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    console.log(`${name} rendered in ${renderTime.toFixed(2)}ms`);
    onMount?.();

    return () => {
      console.log(`${name} unmounted`);
      onUnmount?.();
    };
  }, [name, onMount, onUnmount]);

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
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsed: null,
    mountCount: 0,
    unmountCount: 0,
  });
  const switchStartTime = useRef(performance.now());

  const handleTabSwitch = () => {
    const renderTime = performance.now() - switchStartTime.current;
    const memoryUsed =
      (performance as unknown as { memory?: { usedJSHeapSize: number } })
        .memory?.usedJSHeapSize || null;

    const newMetrics = {
      ...metrics,
      renderTime,
      memoryUsed,
    };
    setMetrics(newMetrics);
    onMetricsUpdate(newMetrics);
    switchStartTime.current = performance.now();
  };

  useEffect(() => {
    handleTabSwitch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleMount = () => {
    setMetrics((prev) => ({ ...prev, mountCount: prev.mountCount + 1 }));
  };

  const handleUnmount = () => {
    setMetrics((prev) => ({ ...prev, unmountCount: prev.unmountCount + 1 }));
  };

  return (
    <>
      <Activity mode={activeTab === "tab1" ? "visible" : "hidden"}>
        <TabContent
          name="Tab 1 Content"
          onMount={handleMount}
          onUnmount={handleUnmount}
        />
      </Activity>

      <Activity mode={activeTab === "tab2" ? "visible" : "hidden"}>
        <TabContent
          name="Tab 2 Content"
          onMount={handleMount}
          onUnmount={handleUnmount}
        />
      </Activity>

      <Activity mode={activeTab === "tab3" ? "visible" : "hidden"}>
        <TabContent
          name="Tab 3 Content"
          onMount={handleMount}
          onUnmount={handleUnmount}
        />
      </Activity>
    </>
  );
};

/**
 * 従来の条件付きレンダリング実装
 */
const ConditionalMode = ({
  activeTab,
  onMetricsUpdate,
}: {
  activeTab: "tab1" | "tab2" | "tab3";
  onMetricsUpdate: (metrics: PerformanceMetrics) => void;
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsed: null,
    mountCount: 0,
    unmountCount: 0,
  });
  const switchStartTime = useRef(performance.now());

  const handleTabSwitch = () => {
    const renderTime = performance.now() - switchStartTime.current;
    const memoryUsed =
      (performance as unknown as { memory?: { usedJSHeapSize: number } })
        .memory?.usedJSHeapSize || null;

    const newMetrics = {
      ...metrics,
      renderTime,
      memoryUsed,
    };
    setMetrics(newMetrics);
    onMetricsUpdate(newMetrics);
    switchStartTime.current = performance.now();
  };

  useEffect(() => {
    handleTabSwitch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleMount = () => {
    setMetrics((prev) => ({ ...prev, mountCount: prev.mountCount + 1 }));
  };

  const handleUnmount = () => {
    setMetrics((prev) => ({ ...prev, unmountCount: prev.unmountCount + 1 }));
  };

  return (
    <>
      {activeTab === "tab1" && (
        <TabContent
          name="Tab 1 Content"
          onMount={handleMount}
          onUnmount={handleUnmount}
        />
      )}
      {activeTab === "tab2" && (
        <TabContent
          name="Tab 2 Content"
          onMount={handleMount}
          onUnmount={handleUnmount}
        />
      )}
      {activeTab === "tab3" && (
        <TabContent
          name="Tab 3 Content"
          onMount={handleMount}
          onUnmount={handleUnmount}
        />
      )}
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
          <span className="metric-label">タブ切り替え時間:</span>
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
        <div className="metric-item">
          <span className="metric-label">マウント回数:</span>
          <span className="metric-value">{metrics.mountCount}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">アンマウント回数:</span>
          <span className="metric-value">{metrics.unmountCount}</span>
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
    mountCount: 0,
    unmountCount: 0,
  });
  const [conditionalMetrics, setConditionalMetrics] =
    useState<PerformanceMetrics>({
      renderTime: 0,
      memoryUsed: null,
      mountCount: 0,
      unmountCount: 0,
    });

  return (
    <div className="app">
      <h1>React 19.2 &lt;Activity /&gt; vs 従来の条件付きレンダリング</h1>
      <p className="description">
        2つのレンダリング方式のパフォーマンスと動作を比較できます。
        <br />
        タブを切り替えて、それぞれの違いを確認してください。
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
        <h3>💡 主な違い</h3>
        <div className="comparison">
          <div className="comparison-item">
            <h4>🚀 Activity モード</h4>
            <ul>
              <li>状態を保持: タブ切り替え後も入力内容が残る</li>
              <li>マウント回数が少ない: 初回のみマウント</li>
              <li>アンマウントなし: コンポーネントが破棄されない</li>
              <li>高速な切り替え: DOMが保持されるため</li>
            </ul>
          </div>
          <div className="comparison-item">
            <h4>📦 条件付きレンダリング</h4>
            <ul>
              <li>状態が失われる: タブ切り替えで入力内容がリセット</li>
              <li>マウント回数が多い: 毎回マウント/アンマウント</li>
              <li>アンマウント頻発: 非表示時に完全に破棄</li>
              <li>切り替えコスト: 毎回DOM再構築が必要</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
