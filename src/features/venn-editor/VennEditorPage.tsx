import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, XCircle, Save, FolderOpen, Trash2, MoreVertical } from 'lucide-react';
import { useEditorState } from './state/editorState';
import { Canvas } from './components/Canvas';
import { FormulaPanel } from './components/FormulaPanel';
import { SegmentsSidebar } from './components/ElementsSidebar';
import { SaveDiagramDialog } from './components/SaveDiagramDialog';
import { LoadDiagramDialog } from './components/LoadDiagramDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { diagramStorage } from '@/services/storage';
import type { SegmentDefinition, SavedDiagram } from '@/services/storage/types';
import type { Segment } from './types';

export function VennEditorPage() {
  const { diagramId: urlDiagramId } = useParams<{ diagramId?: string }>();
  const nextPosRef = useRef({ x: 150, y: 150 });
  const navigate = useNavigate();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const addSegment = useEditorState((s) => s.addSegment);
  const addSegmentFromDefinition = useEditorState((s) => s.addSegmentFromDefinition);
  const deselectAll = useEditorState((s) => s.deselectAll);
  const clearDiagram = useEditorState((s) => s.clearDiagram);
  const setDiagramInfo = useEditorState((s) => s.setDiagramInfo);
  const loadDiagram = useEditorState((s) => s.loadDiagram);
  const regions = useEditorState((s) => s.regions);
  const segments = useEditorState((s) => s.segments);
  const segmentList = useEditorState((s) => s.segmentList);
  const diagramId = useEditorState((s) => s.diagramId);
  const diagramName = useEditorState((s) => s.diagramName);

  // Load diagram from URL parameter on mount, or clear for new diagram
  useEffect(() => {
    if (initialLoadDone) return;

    if (urlDiagramId) {
      // Load existing diagram
      const loadFromUrl = async () => {
        const diagram = await diagramStorage.getById(urlDiagramId);
        if (diagram) {
          const loadedSegments: Record<string, Segment> = {};
          let maxId = 0;

          for (const s of diagram.segments) {
            loadedSegments[s.id] = {
              id: s.id,
              name: s.name,
              code: s.code,
              cx: s.cx,
              cy: s.cy,
              radius: s.radius,
              parentId: null,
              children: [],
              selected: false,
              segmentDefinitionId: s.segmentDefinitionId,
            };

            const match = s.id.match(/segment_(\d+)/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num > maxId) maxId = num;
            }
          }

          loadDiagram(loadedSegments, diagram.selectedRegionIds, maxId + 1);
          setDiagramInfo(diagram.id, diagram.name);
        }
        setInitialLoadDone(true);
      };
      loadFromUrl();
    } else {
      // New diagram - clear everything
      clearDiagram();
      nextPosRef.current = { x: 150, y: 150 };
      setInitialLoadDone(true);
    }
  }, [urlDiagramId, initialLoadDone, loadDiagram, setDiagramInfo, clearDiagram]);

  const handleAddSegment = () => {
    addSegment(nextPosRef.current.x, nextPosRef.current.y);
    nextPosRef.current.x += 60;
    nextPosRef.current.y += 40;

    if (nextPosRef.current.x > 500) {
      nextPosRef.current.x = 150;
      nextPosRef.current.y = 150;
    }
  };

  const handleAddSegmentFromDefinition = (segmentDef: SegmentDefinition) => {
    addSegmentFromDefinition(segmentDef, nextPosRef.current.x, nextPosRef.current.y);
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

  const handleSave = async (name: string, description: string) => {
    const segmentsToSave = Object.values(segments).map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      cx: s.cx,
      cy: s.cy,
      radius: s.radius,
      segmentDefinitionId: s.segmentDefinitionId,
    }));

    const selectedRegionIds = regions.filter((r) => r.selected).map((r) => r.id);

    if (diagramId) {
      await diagramStorage.update(diagramId, {
        name,
        description,
        segments: segmentsToSave,
        selectedRegionIds,
      });
    } else {
      const newDiagram = await diagramStorage.create({
        name,
        description,
        segments: segmentsToSave,
        selectedRegionIds,
      });
      setDiagramInfo(newDiagram.id, newDiagram.name);
    }
  };

  const handleLoad = (diagram: SavedDiagram) => {
    const loadedSegments: Record<string, Segment> = {};
    let maxId = 0;

    for (const s of diagram.segments) {
      loadedSegments[s.id] = {
        id: s.id,
        name: s.name,
        code: s.code,
        cx: s.cx,
        cy: s.cy,
        radius: s.radius,
        parentId: null,
        children: [],
        selected: false,
        segmentDefinitionId: s.segmentDefinitionId,
      };

      const match = s.id.match(/segment_(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxId) maxId = num;
      }
    }

    loadDiagram(loadedSegments, diagram.selectedRegionIds, maxId + 1);
    setDiagramInfo(diagram.id, diagram.name);
  };

  const handleClear = () => {
    clearDiagram();
    nextPosRef.current = { x: 150, y: 150 };
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="border-b bg-card flex-shrink-0">
        <div className="px-2 sm:px-4 h-12 sm:h-14 flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8 sm:h-9 sm:w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {diagramName && (
            <span className="text-sm font-medium text-muted-foreground truncate max-w-[100px] sm:max-w-[200px]">
              {diagramName}
            </span>
          )}

          <div className="flex-1" />

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button onClick={handleAddSegment} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Segment
            </Button>
            <Button variant="outline" onClick={handleClearSelection} size="sm">
              <XCircle className="h-4 w-4 mr-2" />
              Secimi Temizle
            </Button>
            <Button variant="outline" onClick={() => setSaveDialogOpen(true)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
            <Button variant="outline" onClick={() => setLoadDialogOpen(true)} size="sm">
              <FolderOpen className="h-4 w-4 mr-2" />
              Yukle
            </Button>
            <Button variant="destructive" onClick={handleClear} size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Temizle
            </Button>
          </div>

          {/* Mobile: Primary action + dropdown */}
          <div className="flex md:hidden items-center gap-1">
            <Button onClick={handleAddSegment} size="sm" className="h-8 px-2">
              <Plus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleClearSelection}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Secimi Temizle
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSaveDialogOpen(true)}>
                  <Save className="h-4 w-4 mr-2" />
                  Kaydet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLoadDialogOpen(true)}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Yukle
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClear} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Temizle
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <SegmentsSidebar
          onAddSegment={handleAddSegmentFromDefinition}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="absolute inset-0 flex flex-col p-2 sm:p-4 gap-2 sm:gap-4">
          <div className="flex-1 min-h-0 border rounded-lg bg-background overflow-hidden">
            <Canvas />
          </div>
          <FormulaPanel regions={regions} segments={segmentList} />
        </div>
      </main>

      <SaveDiagramDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={diagramName || ''}
        onSave={handleSave}
        isUpdate={!!diagramId}
      />

      <LoadDiagramDialog
        open={loadDialogOpen}
        onOpenChange={setLoadDialogOpen}
        onLoad={handleLoad}
      />
    </div>
  );
}
