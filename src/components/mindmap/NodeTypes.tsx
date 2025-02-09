import { Handle, Position } from 'reactflow';
import { useState, useCallback } from 'react';
import RichTextEditor from './RichTextEditor';
import {  FileImage, Link as LinkIcon, X } from 'lucide-react';

interface NodeData {
  label: string;
  onLabelChange?: (newLabel: string) => void;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  backgroundColor?: string;
  onStyleChange?: (style: { backgroundColor: string }) => void;
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

export const StickyNoteNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="w-64 shadow-lg bg-yellow-50 border-2 border-yellow-200 p-4 rotate-1">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="text-yellow-800">
        <RichTextEditor
          initialValue={data.label}
          onChange={data.onLabelChange || (() => {})}
        />
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export const MediaNode = ({ data }: { data: NodeData }) => {
  const [url, setUrl] = useState(data.mediaUrl || '');
  const [isEditing, setIsEditing] = useState(!data.mediaUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUrl(url);
      data.onLabelChange?.(url);
      setIsEditing(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    data.onLabelChange?.(url);
    setIsEditing(false);
  };

  return (
    <div className="w-64 shadow-lg bg-white border-2 border-slate-200 rounded-lg overflow-hidden">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="relative">
        {isEditing ? (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-md hover:bg-slate-200"
              >
                <FileImage className="w-4 h-4" />
                Upload File
              </button>
              <input
                id="file-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="text-sm text-slate-500">or</div>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter media URL..."
                className="flex-1 px-3 py-2 bg-slate-100 rounded-md"
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-2 right-2 p-1 bg-slate-800/50 rounded-full hover:bg-slate-800/75 text-white"
            >
              <X className="w-4 h-4" />
            </button>
            {data.mediaType === 'video' ? (
              <video
                src={url}
                controls
                className="w-full h-48 object-cover"
              />
            ) : (
              <img
                src={url}
                alt="Media content"
                className="w-full h-48 object-cover"
              />
            )}
          </>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};