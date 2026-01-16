import { useRef } from 'react';
import { useAppState } from './state/AppState';
import { Canvas } from './components/Canvas';
import { FormulaPanel } from './components/FormulaPanel';
import './App.css';

function App() {
  const nextPosRef = useRef({ x: 150, y: 150 });

  const addSegment = useAppState((s) => s.addSegment);
  const deselectAll = useAppState((s) => s.deselectAll);
  const regions = useAppState((s) => s.regions);
  const segmentList = useAppState((s) => s.segmentList);

  const handleAddSegment = () => {
    addSegment(nextPosRef.current.x, nextPosRef.current.y);
    nextPosRef.current.x += 60;
    nextPosRef.current.y += 40;

    if (nextPosRef.current.x > 500) {
      nextPosRef.current.x = 150;
      nextPosRef.current.y = 150;
    }
  };

  const handleClearSelection = () => {
    deselectAll();
  };

  return (
    <div className="app">
      <header className="toolbar">
        <button id="add-segment-btn" onClick={handleAddSegment}>
          Add Segment
        </button>
        <button id="clear-selection-btn" onClick={handleClearSelection}>
          Clear Selection
        </button>
      </header>
      <main className="main-content">
        <Canvas />
        <FormulaPanel regions={regions} segments={segmentList} />
      </main>
    </div>
  );
}

export default App;
