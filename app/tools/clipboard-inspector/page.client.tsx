"use client";

import { useEffect, useState } from "react";

type ClipboardEntry = {
    label: string;
    data: string;
};

const readDataTransfer = async (
    dataTransfer: DataTransfer | null,
): Promise<ClipboardEntry[]> => {
    const next: ClipboardEntry[] = [];
    if (dataTransfer) {
        for (const item of dataTransfer.items) {
            const type = item.type;
            const file = item.getAsFile();
            if (file) {
                const data = await file.text();
                next.push({
                    label: `${type} (${file.size} bytes)`,
                    data,
                });
            }
        }
    }
    return next;
};

const readFromNavigator = async (): Promise<ClipboardEntry[]> => {
    const items = await navigator.clipboard.read();
    const next: ClipboardEntry[] = [];
    for (const item of items) {
        for (const type of item.types) {
            const blob = await item.getType(type);
            const data = await blob.text();
            next.push({
                label: `${type} (${blob.size} bytes)`,
                data,
            });
        }
    }
    return next;
};

export const ClipboardInspectorTool = () => {
    const [entries, setEntries] = useState<ClipboardEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const showEntries = (next: ClipboardEntry[]) => {
        setEntries(next);
        setError(null);
    };

    const readClipboard = async () => {
        setLoading(true);
        setError(null);
        try {
            showEntries(await readFromNavigator());
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Could not read from the clipboard.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const onPaste = async (event: ClipboardEvent) => {
            const fromDataTransfer = await readDataTransfer(
                event.clipboardData,
            );
            if (fromDataTransfer.length > 0) {
                showEntries(fromDataTransfer);
                return;
            }
            try {
                showEntries(await readFromNavigator());
            } catch (e) {
                setError(
                    e instanceof Error
                        ? e.message
                        : "Could not read from the clipboard.",
                );
            }
        };
        window.addEventListener("paste", onPaste);
        return () => window.removeEventListener("paste", onPaste);
    }, []);

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 py-6">
            <div className="flex flex-wrap items-center gap-4">
                <button
                    className="btn"
                    type="button"
                    onClick={readClipboard}
                    disabled={loading}
                >
                    {loading ? "Reading..." : "Read clipboard"}
                </button>
                <span className="text-base-content/60 text-sm">
                    Or press Ctrl+V to read the clipboard.
                </span>
            </div>
            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}
            {entries.length === 0 && !error && (
                <p className="text-base-content/60">
                    No entries yet. Read the clipboard or paste something.
                </p>
            )}
            <div className="flex flex-col gap-6">
                {entries.map((entry, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <h2 className="font-mono text-sm font-semibold">
                            {entry.label}
                        </h2>
                        <pre className="max-h-96 overflow-auto rounded-box bg-base-200 p-4 font-mono text-xs whitespace-pre-wrap break-words">
                            {entry.data}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
};
