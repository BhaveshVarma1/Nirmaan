import { Square, Circle, Diamond, Undo, Redo, Save, Trash2, StickyNote, Image } from 'lucide-react';

interface ToolbarProps {
  onAddNode: (type: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onClear: () => void;
}

const MindMapToolbar = ({ onAddNode, onUndo, onRedo, onSave, onClear }: ToolbarProps) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 z-10">
      <div className="flex items-center gap-2 px-2 border-r border-slate-700">
        <button
          onClick={() => onAddNode('basic')}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-slate-50 transition-colors"
          title="Add Basic Node"
        >
          <Square className="w-5 h-5" />
        </button>
        <button
          onClick={() => onAddNode('circle')}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-slate-50 transition-colors"
          title="Add Circle Node"
        >
          <Circle className="w-5 h-5" />
        </button>
        <button
          onClick={() => onAddNode('diamond')}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-slate-50 transition-colors"
          title="Add Diamond Node"
        >
          <Diamond className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 px-2 border-r border-slate-700">
        <button
          onClick={() => onAddNode('sticky')}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-slate-50 transition-colors"
          title="Add Sticky Note"
        >
          <StickyNote className="w-5 h-5" />
        </button>
        <button
          onClick={() => onAddNode('media')}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-slate-50 transition-colors"
          title="Add Media"
        >
          <Image className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 px-2 border-r border-slate-700">
        <button
          onClick={onUndo}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-slate-50 transition-colors"
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={onRedo}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-slate-50 transition-colors"
          title="Redo"
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 px-2">
        <button
          onClick={onSave}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-slate-50 transition-colors"
          title="Save"
        >
          <Save className="w-5 h-5" />
        </button>
        <button
          onClick={onClear}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-slate-50 transition-colors"
          title="Clear"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MindMapToolbar;