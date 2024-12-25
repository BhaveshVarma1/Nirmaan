import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { BubbleMenu } from '@tiptap/react';
import {
  Bold,
  Italic,
  Code,
  List,
  Heading,
  Quote,
  ListOrdered,
  Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const bubbleMenuItems = [
    {
      icon: Bold,
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
      tooltip: 'Bold',
    },
    {
      icon: Italic,
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
      tooltip: 'Italic',
    },
    {
      icon: Code,
      command: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
      tooltip: 'Code',
    },
  ];

  const blockMenuItems = [
    {
      icon: Heading,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
      tooltip: 'Heading 1',
    },
    {
      icon: List,
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
      tooltip: 'Bullet List',
    },
    {
      icon: ListOrdered,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
      tooltip: 'Numbered List',
    },
    {
      icon: Quote,
      command: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
      tooltip: 'Quote',
    },
    {
      icon: Minus,
      command: () => editor.chain().focus().setHorizontalRule().run(),
      tooltip: 'Divider',
    },
  ];

  return (
    <div className="relative">
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-lg"
        >
          {bubbleMenuItems.map((item, index) => (
            <Button
              key={index}
              size="sm"
              variant="ghost"
              className={`px-2 py-1 ${
                item.isActive?.() ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
              onClick={item.command}
              title={item.tooltip}
            >
              <item.icon className="h-4 w-4" />
            </Button>
          ))}
        </BubbleMenu>
      )}
      
      <div className="mb-2 flex flex-wrap gap-1">
        {blockMenuItems.map((item, index) => (
          <Button
            key={index}
            size="sm"
            variant="ghost"
            className={`px-2 py-1 ${
              item.isActive?.() ? 'bg-slate-700 text-white' : 'text-slate-400'
            }`}
            onClick={item.command}
            title={item.tooltip}
          >
            <item.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="min-h-[150px] rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor; 