import { useEffect, useRef } from "react";
import type { PerformanceMetrics } from "../types/metrics";

/**
 * タブの状態を管理する型
 */
interface TabState {
  count: number;
  text: string;
}

/**
 * タブコンテンツ（状態を親から受け取る）
 * Props Drilling: onMount は複数階層を通して渡される
 */
const TabContentWithProps = ({
  name,
  count,
  text,
  onCountChange,
  onTextChange,
  onMount,
}: {
  name: string;
  count: number;
  text: string;
  onCountChange: (count: number) => void;
  onTextChange: (text: string) => void;
  onMount?: () => void;
}) => {
  useEffect(() => {
    onMount?.();
  }, [name, onMount]);

  return (
    <div className="tab-content">
      <h2>{name}</h2>
      <div className="card">
        <button onClick={() => onCountChange(count + 1)}>
          count is {count}
        </button>
        <p>カウンター: {count}</p>
      </div>
      <div className="card">
        <input
          type="text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="テキストを入力..."
          className="text-input"
        />
        <p>入力内容: {text || "(空)"}</p>
      </div>
    </div>
  );
};

/**
 * Props Drilling パターン
 * 条件付きレンダリングで状態を保持する実装
 */
export const PropsDrillingMode = ({
  activeTab,
  tab1State,
  tab2State,
  tab3State,
  onTab1StateChange,
  onTab2StateChange,
  onTab3StateChange,
  onMetricsUpdate,
}: {
  activeTab: "tab1" | "tab2" | "tab3";
  tab1State: TabState;
  tab2State: TabState;
  tab3State: TabState;
  onTab1StateChange: (state: TabState) => void;
  onTab2StateChange: (state: TabState) => void;
  onTab3StateChange: (state: TabState) => void;
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

  // Props Drilling: 各タブの状態と更新関数をProps経由で渡す必要がある
  return (
    <>
      {activeTab === "tab1" && (
        <TabContentWithProps
          name="Tab 1 Content"
          count={tab1State.count}
          text={tab1State.text}
          onCountChange={(count) => onTab1StateChange({ ...tab1State, count })}
          onTextChange={(text) => onTab1StateChange({ ...tab1State, text })}
          onMount={() => console.log("Tab 1 mounted")}
        />
      )}
      {activeTab === "tab2" && (
        <TabContentWithProps
          name="Tab 2 Content"
          count={tab2State.count}
          text={tab2State.text}
          onCountChange={(count) => onTab2StateChange({ ...tab2State, count })}
          onTextChange={(text) => onTab2StateChange({ ...tab2State, text })}
          onMount={() => console.log("Tab 2 mounted")}
        />
      )}
      {activeTab === "tab3" && (
        <TabContentWithProps
          name="Tab 3 Content"
          count={tab3State.count}
          text={tab3State.text}
          onCountChange={(count) => onTab3StateChange({ ...tab3State, count })}
          onTextChange={(text) => onTab3StateChange({ ...tab3State, text })}
          onMount={() => console.log("Tab 3 mounted")}
        />
      )}
    </>
  );
};
