import { Handle, Position } from 'reactflow';
import { useState, useCallback } from 'react';

interface NodeData {
  label: string;
  onLabelChange?: (newLabel: string) => void;
}

const EditableLabel = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditValue(value);
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    onChange(editValue);
  }, [editValue, onChange]);

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        className="bg-transparent border-none focus:outline-none text-center w-full"
        autoFocus
      />
    );
  }

  return (
    <div onDoubleClick={handleDoubleClick} className="cursor-text">
      {value}
    </div>
  );
};

export const BasicNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-md bg-white border-2 border-slate-200">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="text-slate-800">
        <EditableLabel value={data.label} onChange={data.onLabelChange || (() => {})} />
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export const RectangleNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-sm bg-blue-50 border-2 border-blue-200 min-w-[100px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="text-blue-800 font-medium">
        <EditableLabel value={data.label} onChange={data.onLabelChange || (() => {})} />
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export const CircleNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="w-24 h-24 shadow-lg rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="text-green-800 font-medium text-center px-2">
        <EditableLabel value={data.label} onChange={data.onLabelChange || (() => {})} />
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export const DiamondNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="w-32 h-32 shadow-lg bg-purple-50 border-2 border-purple-200 rotate-45">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="absolute inset-0 -rotate-45 flex items-center justify-center">
        <div className="text-purple-800 font-medium text-center px-2">
          <EditableLabel value={data.label} onChange={data.onLabelChange || (() => {})} />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}; 