import { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  useReactFlow,
  ConnectionMode,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { BasicNode, RectangleNode, CircleNode, DiamondNode, StickyNoteNode, MediaNode } from './NodeTypes';
import MindMapToolbar from './MindMapToolbar';

const nodeTypes = {
  basic: BasicNode,
  rectangle: RectangleNode,
  circle: CircleNode,
  diamond: DiamondNode,
  sticky: StickyNoteNode,
  media: MediaNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'basic',
    data: { label: 'Main Idea' },
    position: { x: 0, y: 0 },
  },
];

const MindMapFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [undoStack, setUndoStack] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [redoStack, setRedoStack] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);

  const { project } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      saveCurrentState();
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [setEdges]
  );

  const saveCurrentState = () => {
    setUndoStack((stack) => [...stack, { nodes, edges }]);
    setRedoStack([]);
  };

  const onLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      saveCurrentState();
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
        )
      );
    },
    [setNodes]
  );

  const onAddNode = useCallback(
    (type: string) => {
      if (!reactFlowWrapper.current) return;

      const position = project({
        x: Math.random() * 500,
        y: Math.random() * 500,
      });

      const newNode: Node = {
        id: crypto.randomUUID(),
        type,
        position,
        data: { 
          label: type === 'sticky' ? '<p>New Note</p>' : type === 'media' ? '' : 'New Node',
          onLabelChange: (newLabel: string) => onLabelChange(newNode.id, newLabel),
          mediaUrl: '',
          mediaType: undefined,
        },
      };

      saveCurrentState();
      setNodes((nds) => [...nds, newNode]);
    },
    [project, setNodes, onLabelChange]
  );

  // Initialize nodes with label change handlers
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onLabelChange: (newLabel: string) => onLabelChange(node.id, newLabel),
        },
      }))
    );
  }, [setNodes, onLabelChange]);

  const onUndo = () => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack((stack) => [...stack, { nodes, edges }]);
    setUndoStack((stack) => stack.slice(0, -1));
    setNodes(previousState.nodes);
    setEdges(previousState.edges);
  };

  const onRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack((stack) => [...stack, { nodes, edges }]);
    setRedoStack((stack) => stack.slice(0, -1));
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
  };

  const onSave = () => {
    const flow = {
      nodes,
      edges,
    };
    const json = JSON.stringify(flow);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onClear = () => {
    saveCurrentState();
    setNodes([]);
    setEdges([]);
  };

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <MindMapToolbar
        onAddNode={onAddNode}
        onUndo={onUndo}
        onRedo={onRedo}
        onSave={onSave}
        onClear={onClear}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        className="bg-slate-900"
        defaultEdgeOptions={{
          style: { stroke: '#64748b' },
          type: 'smoothstep',
        }}
      >
        <Background color="#475569" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

const MindMap = () => {
  return (
    <ReactFlowProvider>
      <div className="w-full h-[calc(100vh-4rem)]">
        <MindMapFlow />
      </div>
    </ReactFlowProvider>
  );
};

export default MindMap;