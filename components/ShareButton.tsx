/**
 * Share Button Component
 * 
 * Creates a shareable URL with compressed JSON.
 * Handles:
 * - URL generation
 * - Clipboard copy
 * - Error handling for large JSON
 */

'use client';

import { createShareableUrl } from '@/lib/urlUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { useState } from 'react';

interface ShareButtonProps {
    jsonString: string;
    disabled?: boolean;
}

export default function ShareButton({ jsonString, disabled }: ShareButtonProps) {
    const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

    const handleShare = async () => {
        try {
            const shareUrl = createShareableUrl(jsonString);

            // Check if URL is too long (browser limit is ~2000 chars)
            if (shareUrl.length > 2000) {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
                alert('JSON is too large to share via URL. Try with smaller JSON.');
                return;
            }

            await copyToClipboard(shareUrl);
            setStatus('copied');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (error) {
            console.error('Failed to create share URL:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const getButtonText = () => {
        switch (status) {
            case 'copied': return '✓ Link Copied!';
            case 'error': return '✗ Too Large';
            default: return '🔗 Share';
        }
    };

    const getButtonClass = () => {
        const baseClass = 'px-4 py-2 text-sm rounded transition-colors';

        if (disabled) {
            return `${baseClass} bg-gray-800 text-gray-500 cursor-not-allowed`;
        }

        switch (status) {
            case 'copied':
                return `${baseClass} bg-green-700 text-white`;
            case 'error':
                return `${baseClass} bg-red-700 text-white`;
            default:
                return `${baseClass} bg-blue-600 hover:bg-blue-700 text-white`;
        }
    };

    return (
        <button
            onClick={handleShare}
            disabled={disabled || !jsonString}
            className={getButtonClass()}
            title="Create shareable link with compressed JSON"
        >
            {getButtonText()}
        </button>
    );
}
