import type { Metadata } from "next";
import { ClipboardInspectorTool } from "./page.client";

export const metadata: Metadata = {
    title: "Clipboard Inspector",
    description:
        "See everything currently on your clipboard. Inspect MIME types, sizes, and raw content of every clipboard entry.",
    openGraph: {
        description:
            "See everything currently on your clipboard. Inspect MIME types, sizes, and raw content of every clipboard entry.",
        type: "website",
        url: "/tools/clipboard-inspector",
    },
};

const Page = () => {
    return (
        <div className="flex flex-1 flex-col">
            <ClipboardInspectorTool />
        </div>
    );
};

export default Page;
