import React, { useState } from 'react';
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

    const handleAddText = (type: 'text' | 'heading' | 'subheading') => {
        const defaultText = {
            heading: 'Heading',
            subheading: 'Subheading',
            text: 'Body Text'
        }[type];

        const newNode: TextNode = {
            id: `text-${Date.now()}`,
            x: 50,
            y: textNodes.length * 50 + 50,
            text: defaultText,
            type
        };
        setTextNodes([...textNodes, newNode]);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Canva" />
            <div className="flex h-screen bg-gray-100">
                <Toolbar onAddText={handleAddText} />
                <div className="flex-1 p-12">
                    <div className="bg-white rounded-lg shadow-lg h-[90%] w-[90%] mx-auto">
                        <Canvas
                            textNodes={textNodes}
                            selectedId={selectedId}
                            onChange={setTextNodes}
                            onSelect={setSelectedId}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default App;
