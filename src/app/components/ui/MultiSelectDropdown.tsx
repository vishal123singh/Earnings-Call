import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Item {
  [key: string]: any;
}

interface MultiSelectDropdownProps<T extends Item> {
  items: T[];
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  getImage?: (item: T) => string | undefined;
  placeholder?: string;
}

export default function MultiSelectDropdown<T extends Item>({
  items,
  selectedKeys,
  setSelectedKeys,
  getKey,
  getLabel,
  getImage,
  placeholder = 'Select items...',
}: MultiSelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleItem = (key: string) => {
    setSelectedKeys(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const removeItem = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedKeys(prev => prev.filter(k => k !== key));
  };

  const filteredItems = items.filter(item => {
    const label = getLabel(item).toLowerCase();
    return label.includes(searchTerm.toLowerCase()) || getKey(item).toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex flex-wrap items-center gap-2 p-2 border rounded-lg cursor-pointer bg-white min-h-12"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedKeys.length === 0 ? (
          <span className="text-gray-400 ml-2">{placeholder}</span>
        ) : (
          selectedKeys.map(key => {
            const item = items.find(i => getKey(i) === key);
            if (!item) return null;
            return (
              <div
                key={key}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                {getImage && getImage(item) && (
                  <Image
                    src={getImage(item)!}
                    alt={getLabel(item)}
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                )}
                <span>{getLabel(item)}</span>
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-700"
                  onClick={(e) => removeItem(key, e)}
                >
                  ×
                </button>
              </div>
            );
          })
        )}
        <div className="ml-auto">
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-white p-2 border-b">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="divide-y">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => {
                const key = getKey(item);
                return (
                  <div
                    key={key}
                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${selectedKeys.includes(key) ? 'bg-blue-50' : ''}`}
                    onClick={() => toggleItem(key)}
                  >
                    {getImage && getImage(item) && (
                      <div className="flex-shrink-0 mr-3">
                        <Image
                          src={getImage(item)!}
                          alt={getLabel(item)}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{getLabel(item)}</div>
                      <div className="text-sm text-gray-500">{key}</div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {selectedKeys.includes(key) ? (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-5 h-5 border rounded border-gray-300" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
