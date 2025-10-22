import { Activity, useState, useEffect, useRef } from "react";
import type { PerformanceMetrics } from "../types/metrics";

/**
 * タブコンテンツコンポーネント
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
export const ActivityMode = ({
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
