import React from 'react';
import { Stage, Layer, Text, Transformer } from 'react-konva';

interface TextNode {
    id: string;
    x: number;
    y: number;
    text: string;
    type: 'text' | 'heading' | 'subheading';
    width?: number;
}

interface CanvasProps {
    textNodes: TextNode[];
    selectedId: string | null;
    onChange: (nodes: TextNode[]) => void;
    onSelect: (id: string | null) => void;
    onDuplicate: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ textNodes, selectedId, onChange, onSelect, onDuplicate }) => {
    const stageRef = React.useRef<any>(null);
    const transformerRef = React.useRef<any>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
    const [editingId, setEditingId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (containerRef.current) {
            const updateDimensions = () => {
                const container = containerRef.current;
                if (container) {
                    setDimensions({
                        width: container.offsetWidth,
                        height: container.offsetHeight
                    });
                }
            };

            updateDimensions();
            window.addEventListener('resize', updateDimensions);
            return () => window.removeEventListener('resize', updateDimensions);
        }
    }, []);

    React.useEffect(() => {
        if (selectedId && transformerRef.current && !editingId) {
            const node = transformerRef.current.nodes([
                stageRef.current?.findOne(`#${selectedId}`),
            ]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedId, editingId]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' && selectedId) {
                handleDelete(selectedId);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedId) {
                e.preventDefault();
                onDuplicate();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, onDuplicate]);

    const getFontProps = (type: string) => {
        switch (type) {
            case 'heading':
                return {
                    fontSize: 92,
                    fontStyle: 'bold',
                    fill: '#1a1a1a',
                    padding: 5,
                };
            case 'subheading':
                return {
                    fontSize: 72,
                    fontStyle: 'bold',
                    fill: '#333333',
                    padding: 5,
                };
            default:
                return {
                    fontSize: 56,
                    fontStyle: 'normal',
                    fill: '#4a4a4a',
                    padding: 5,
                };
        }
    };

    const handleTextEdit = (nodeId: string) => {
        const node = textNodes.find(n => n.id === nodeId);
        if (!node) return;

        const stage = stageRef.current;
        const textNode = stage.findOne(`#${nodeId}`);
        const stageBox = stage.container().getBoundingClientRect();

        const textPosition = textNode.absolutePosition();
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        const fontProps = getFontProps(node.type);

        textarea.value = node.text;
        textarea.style.position = 'absolute';
        textarea.style.top = `${stageBox.top + textPosition.y}px`;
        textarea.style.left = `${stageBox.left + textPosition.x}px`;
        textarea.style.width = `${node.width || 300}px`;
        textarea.style.height = `${textNode.height() + 50}px`;
        textarea.style.fontSize = `${fontProps.fontSize}px`;
        textarea.style.border = '1px solid #999';
        textarea.style.padding = '5px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'white';
        textarea.style.color = 'black';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = '1.2';
        textarea.style.fontFamily = 'sans-serif';
        textarea.style.fontWeight = fontProps.fontStyle === 'bold' ? 'bold' : 'normal';
        textarea.style.boxSizing = 'border-box';
        textarea.style.zIndex = '1000';

        setEditingId(nodeId);
        textarea.focus();

        const handleOutsideClick = (e: MouseEvent) => {
            if (e.target !== textarea) {
                removeTextarea();
            }
        };

        const removeTextarea = () => {
            document.body.removeChild(textarea);
            window.removeEventListener('click', handleOutsideClick);
            setEditingId(null);

            const newText = textarea.value;
            if (newText !== node.text) {
                const updatedNodes = textNodes.map(item =>
                    item.id === nodeId ? { ...item, text: newText } : item
                );
                onChange(updatedNodes);
            }
        };

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                textarea.blur();
            }
            if (e.key === 'Escape') {
                textarea.blur();
            }
        });

        textarea.addEventListener('blur', removeTextarea);

        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
        });
    };

    const handleDelete = (nodeId: string) => {
        const updatedNodes = textNodes.filter(node => node.id !== nodeId);
        onChange(updatedNodes);
        onSelect(null);
    };

    return (
        <div ref={containerRef} className="w-full h-full relative">
            <Stage
                width={dimensions.width}
                height={dimensions.height}
                ref={stageRef}
                onClick={(e) => {
                    const clickedOnEmpty = e.target === e.target.getStage();
                    if (clickedOnEmpty) {
                        onSelect(null);
                    }
                }}
            >
                <Layer>
                    {textNodes.map((node) => (
                        <Text
                            key={node.id}
                            id={node.id}
                            x={node.x}
                            y={node.y}
                            text={node.text}
                            draggable
                            width={node.width}
                            wrap="word"
                            {...getFontProps(node.type)}
                            onClick={() => {
                                if (editingId !== node.id) {
                                    onSelect(node.id);
                                }
                            }}
                            onDblClick={() => handleTextEdit(node.id)}
                            onDragStart={() => {
                                if (editingId !== node.id) {
                                    onSelect(node.id);
                                }
                            }}
                            onDragEnd={(e) => {
                                const nodes = textNodes.map((item) =>
                                    item.id === node.id
                                        ? { ...item, x: e.target.x(), y: e.target.y() }
                                        : item
                                );
                                onChange(nodes);
                            }}
                            onTransformEnd={(e) => {
                                const scaleX = e.target.scaleX();
                                const width = Math.max(50, e.target.width() * scaleX); // Ensure minimum width
                                const updatedNodes = textNodes.map((item) =>
                                    item.id === node.id
                                        ? { ...item, width: width, scaleX: 1 } // Reset scaleX after resizing
                                        : item
                                );
                                onChange(updatedNodes);
                                e.target.scaleX(1);
                            }}
                        />
                    ))}
                    {selectedId && !editingId && <Transformer ref={transformerRef} />}
                </Layer>
            </Stage>
        </div>
    );
};

export default Canvas;
