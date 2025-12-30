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
import { Upload, Sparkles, Trash2, AlertCircle, Lightbulb } from 'lucide-react';
import { prettifyJson } from '@/lib/jsonUtils';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

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
        <div className="flex flex-col h-full">
            {/* Header with actions */}
            <div className="flex items-center justify-between p-3 panel-header">
                <h2 className="text-sm font-medium text-[var(--text-bright)]">JSON Input</h2>
                <div className="flex gap-2">
                    <Tooltip content="Upload JSON file">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="h-4 w-4" />
                            Upload
                        </Button>
                    </Tooltip>
                    <Tooltip content="Format JSON">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handlePrettify}
                            disabled={!value || !!error}
                        >
                            <Sparkles className="h-4 w-4" />
                            Prettify
                        </Button>
                    </Tooltip>
                    <Tooltip content="Clear input">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            disabled={!value}
                            className="text-[var(--color-error)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear
                        </Button>
                    </Tooltip>
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
                className={`flex-1 relative ${isDragging ? 'bg-[var(--color-primary)]/10' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <textarea
                    value={value}
                    onChange={handleTextChange}
                    placeholder=""
                    className="w-full h-full p-4 bg-transparent text-[var(--text-main)] font-mono text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset placeholder-[var(--text-muted)]"
                    spellCheck={false}
                />

                {/* Drag overlay */}
                {isDragging && (
                    <div className="absolute inset-0 bg-[var(--color-primary)]/20 border-2 border-dashed border-[var(--color-primary)] flex items-center justify-center rounded">
                        <p className="text-[var(--color-primary)] font-medium">Drop JSON file here</p>
                    </div>
                )}
            </div>

            {/* Error display */}
            {error && (
                <div className="p-3 bg-[var(--color-error)]/10 border-t border-[var(--color-error)]/50 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[var(--color-error)] flex-shrink-0" />
                    <p className="text-sm text-[var(--color-error)]">{error}</p>
                </div>
            )}

            {/* Helper text */}
            {!value && !error && (
                <div className="p-3 border-t border-[var(--border-main)] flex items-center justify-center gap-2">
                    <Lightbulb className="h-4 w-4 text-[var(--text-muted)]" />
                    <p className="text-sm text-[var(--text-muted)]">
                        Paste JSON, upload a file, or drag &amp; drop
                    </p>
                </div>
            )}
        </div>
    );
}
