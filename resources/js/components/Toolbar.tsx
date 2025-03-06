import React from 'react';
import { Type, Type as TypeH1, Type as TypeH2 } from 'lucide-react';

interface ToolbarProps {
  onAddText: (type: 'text' | 'heading' | 'subheading') => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddText }) => {
  return (
    <div className="bg-white shadow-lg p-4 w-64">
      {/* <h2 className="text-lg font-semibold mb-4">Add Elements</h2> */}
      <div className="space-y-2">
        <button
          onClick={() => onAddText('heading')}
          className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors dark:text-black"
        >
          <TypeH1 className="w-5 h-5" />
          <span>Add a heading</span>
        </button>
        <button
          onClick={() => onAddText('subheading')}
          className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors dark:text-black"
        >
          <TypeH2 className="w-5 h-5" />
          <span>Add a sub heading</span>
        </button>
        <button
          onClick={() => onAddText('text')}
          className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors dark:text-black"
        >
          <Type className="w-5 h-5" />
          <span>Add a line of body text</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
