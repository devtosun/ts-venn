import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, XCircle } from 'lucide-react';
import { useEditorState } from './state/editorState';
import { Canvas } from './components/Canvas';
import { FormulaPanel } from './components/FormulaPanel';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-2 sm:px-4 h-14 flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="px-2 sm:px-3">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <Button onClick={handleAddSegment} size="sm" className="sm:size-default">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Segment</span>
          </Button>
          <Button variant="outline" onClick={handleClearSelection} size="sm" className="sm:size-default">
            <XCircle className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Clear Selection</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col p-2 sm:p-4 gap-2 sm:gap-4 min-h-0">
        <div className="flex-1 min-h-[300px] sm:min-h-[400px]">
          <Canvas />
        </div>
        <FormulaPanel regions={regions} segments={segmentList} />
      </main>
    </div>
  );
}
