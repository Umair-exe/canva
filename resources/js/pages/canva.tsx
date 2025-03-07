import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Toolbar from '@/components/Toolbar';
import Canvas from '@/components/Canvas';
import type { BreadcrumbItem } from '@/types';

interface TextNode {
    id: string;
    x: number;
    y: number;
    text: string;
    type: 'text' | 'heading' | 'subheading';
    width?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Canva',
        href: '/canva',
    },
];

function App() {
    const [textNodes, setTextNodes] = useState<TextNode[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const canvasWidth = window.innerWidth * 0.6;
        const canvasHeight = window.innerHeight * 0.7;
        setCanvasDimensions({ width: canvasWidth, height: canvasHeight });
    }, []);

    const handleAddText = (type: 'text' | 'heading' | 'subheading') => {
        const defaultText = {
            heading: 'Heading',
            subheading: 'Subheading',
            text: 'Body Text'
        }[type];

        let x = 50;
        let y = 50;

        if (textNodes.length === 0) {
            x = canvasDimensions.width / 2 - 150;
            y = canvasDimensions.height / 2 - 25;
        } else if (selectedId) {
            const selectedNode = textNodes.find(node => node.id === selectedId);
            if (selectedNode) {
                x = selectedNode.x;
                y = selectedNode.y + 80;
            }
        }

        const newNode: TextNode = {
            id: `text-${Date.now()}`,
            x,
            y,
            text: defaultText,
            type,
            width: type === 'heading' ? 400 : (type=== 'subheading') ? 500 : 300,
        };
        setTextNodes([...textNodes, newNode]);
        setSelectedId(newNode.id);
    };

    const handleDuplicateText = () => {
        if (selectedId) {
            const selectedNode = textNodes.find(node => node.id === selectedId);
            if (selectedNode) {
                const newNode: TextNode = {
                    ...selectedNode,
                    id: `text-${Date.now()}`,
                    x: selectedNode.x + 10,
                    y: selectedNode.y + 10,
                };
                setTextNodes([...textNodes, newNode]);
                setSelectedId(newNode.id);
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Canva" />
            <div className="flex h-screen bg-gray-100">
                <Toolbar onAddText={handleAddText} onDuplicateText={handleDuplicateText} />
                <div className="flex-1 p-12">
                    <div className="bg-white rounded-lg shadow-lg h-[90%] w-[90%] mx-auto">
                        <Canvas
                            textNodes={textNodes}
                            selectedId={selectedId}
                            onChange={setTextNodes}
                            onSelect={setSelectedId}
                            onDuplicate={handleDuplicateText}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default App;
