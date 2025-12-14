/**
 * URL Utilities
 * 
 * Handles encoding/decoding JSON for shareable URLs
 */

import pako from 'pako';

/**
 * Compresses and encodes JSON for URL
 * @param json - JSON string to encode
 * @returns Base64 encoded compressed string
 */
export function encodeJsonToUrl(json: string): string {
    try {
        // Compress the JSON string
        const compressed = pako.deflate(json, { level: 9 });
        // Convert to base64
        const base64 = btoa(String.fromCharCode(...compressed));
        // Make it URL-safe
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    } catch (error) {
        console.error('Failed to encode JSON:', error);
        throw new Error('Failed to encode JSON for URL');
    }
}

/**
 * Decodes and decompresses JSON from URL
 * @param encoded - Encoded string from URL
 * @returns Original JSON string
 */
export function decodeJsonFromUrl(encoded: string): string {
    try {
        // Restore URL-safe base64 to regular base64
        const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        // Pad with '=' if needed
        const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4);
        // Decode base64
        const binary = atob(padded);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        // Decompress
        const decompressed = pako.inflate(bytes, { to: 'string' });
        return decompressed;
    } catch (error) {
        console.error('Failed to decode JSON:', error);
        throw new Error('Failed to decode JSON from URL');
    }
}

/**
 * Creates a shareable URL with encoded JSON
 * @param json - JSON string to share
 * @param baseUrl - Base URL of the application
 * @returns Full shareable URL
 */
export function createShareableUrl(json: string, baseUrl: string = window.location.origin): string {
    const encoded = encodeJsonToUrl(json);
    return `${baseUrl}?json=${encoded}`;
}

/**
 * Extracts JSON from URL parameters
 * @returns Decoded JSON string or null if not present
 */
export function getJsonFromUrl(): string | null {
    if (typeof window === 'undefined') return null;

    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('json');

    if (!encoded) return null;

    try {
        return decodeJsonFromUrl(encoded);
    } catch {
        return null;
    }
}
