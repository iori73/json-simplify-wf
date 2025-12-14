/**
 * Clipboard Utilities
 * 
 * Helper functions for copying text to clipboard
 */

/**
 * Copies text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copy is successful
 */
export async function copyToClipboard(text: string): Promise<void> {
    try {
        // Modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } finally {
            document.body.removeChild(textArea);
        }
    } catch (error) {
        console.error('Failed to copy:', error);
        throw new Error('Failed to copy to clipboard');
    }
}

/**
 * Shows a temporary notification (can be enhanced with a toast library later)
 * @param message - Message to show
 * @param duration - Duration in milliseconds
 */
export function showNotification(message: string, duration: number = 2000): void {
    // Simple console log for now - junior devs can enhance this with a toast library
    console.log(`✓ ${message}`);

    // Could be enhanced with a proper toast notification library
    // For now, this keeps it simple
}
