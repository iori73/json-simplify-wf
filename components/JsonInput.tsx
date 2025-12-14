/**
 * JSON Input Component
 * 
 * Left panel component that handles JSON input via:
 * - Direct paste/typing
 * - File upload
 * - Validation and error display
 * 
 * This component is controlled - it receives JSON and calls onChange
 */

'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { validateJson, prettifyJson } from '@/lib/jsonUtils';

interface JsonInputProps {
    value: string;
    onChange: (json: string) => void;
    error: string | null;
}

export default function JsonInput({ value, onChange, error }: JsonInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Handle textarea changes
    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    // Handle file upload
    const handleFileUpload = (file: File) => {
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            alert('Please upload a JSON file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            onChange(text);
        };
        reader.readAsText(file);
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    // Handle file input change
    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    // Prettify JSON
    const handlePrettify = () => {
        const prettified = prettifyJson(value);
        onChange(prettified);
    };

    // Clear input
    const handleClear = () => {
        onChange('');
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700">
            {/* Header with actions */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <h2 className="text-sm font-semibold text-gray-200">JSON Input</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition-colors"
                        title="Upload JSON file"
                    >
                        Upload
                    </button>
                    <button
                        onClick={handlePrettify}
                        disabled={!value || !!error}
                        className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Format JSON"
                    >
                        Prettify
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={!value}
                        className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Clear input"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Text area for JSON input */}
            <div
                className={`flex-1 relative ${isDragging ? 'bg-gray-800' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <textarea
                    value={value}
                    onChange={handleTextChange}
                    placeholder="Paste JSON here or drag & drop a .json file..."
                    className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
                    spellCheck={false}
                />

                {/* Drag overlay */}
                {isDragging && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-500 flex items-center justify-center">
                        <p className="text-blue-400 font-semibold">Drop JSON file here</p>
                    </div>
                )}
            </div>

            {/* Error display */}
            {error && (
                <div className="p-3 bg-red-900 bg-opacity-30 border-t border-red-700">
                    <p className="text-xs text-red-400 font-mono">{error}</p>
                </div>
            )}

            {/* Helper text */}
            {!value && !error && (
                <div className="p-3 bg-gray-800 bg-opacity-50 border-t border-gray-700">
                    <p className="text-xs text-gray-400">
                        💡 Paste JSON, upload a file, or drag & drop
                    </p>
                </div>
            )}
        </div>
    );
}
