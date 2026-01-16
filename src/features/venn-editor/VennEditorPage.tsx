import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorState } from './state/editorState';
import { Canvas } from './components/Canvas';
import { FormulaPanel } from './components/FormulaPanel';

export function VennEditorPage() {
  const nextPosRef = useRef({ x: 150, y: 150 });
  const navigate = useNavigate();

  const addSegment = useEditorState((s) => s.addSegment);
  const deselectAll = useEditorState((s) => s.deselectAll);
  const regions = useEditorState((s) => s.regions);
  const segmentList = useEditorState((s) => s.segmentList);

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

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="editor-page">
      <header className="toolbar">
        <button className="back-btn" onClick={handleBack}>
          Back
        </button>
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
