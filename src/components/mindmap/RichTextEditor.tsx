import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface RichTextEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
  };

  return (
    <div className="rich-text-editor">
      {isEditing && (
        <div className="flex gap-1 mb-2 p-1 bg-slate-800 rounded-md">
          <button
            onClick={() => handleFormat('bold')}
            className="p-1 hover:bg-slate-700 rounded"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat('italic')}
            className="p-1 hover:bg-slate-700 rounded"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat('underline')}
            className="p-1 hover:bg-slate-700 rounded"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          <div className="w-px bg-slate-700 mx-1" />
          <button
            onClick={() => handleFormat('justifyLeft')}
            className="p-1 hover:bg-slate-700 rounded"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat('justifyCenter')}
            className="p-1 hover:bg-slate-700 rounded"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat('justifyRight')}
            className="p-1 hover:bg-slate-700 rounded"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <div className="w-px bg-slate-700 mx-1" />
          <select
            onChange={(e) => document.execCommand('fontSize', false, e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded text-sm"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>
        </div>
      )}
      <div
        className="min-h-[40px] p-2 rounded-md focus:outline-none"
        contentEditable
        onFocus={() => setIsEditing(true)}
        onBlur={(e) => {
          setIsEditing(false);
          onChange(e.currentTarget.innerHTML);
        }}
        dangerouslySetInnerHTML={{ __html: initialValue }}
      />
    </div>
  );
};

export default RichTextEditor;