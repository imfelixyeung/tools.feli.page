import type { Metadata } from "next";
import { CleanHTMLTool } from "./page.client";

export const metadata: Metadata = {
    title: "Clean HTML",
    description:
        "Paste messy HTML and get back clean, formatted, pretty-printed code. Sanitizes content through Markdown and back.",
    openGraph: {
        description:
            "Paste messy HTML and get back clean, formatted, pretty-printed code. Sanitizes content through Markdown and back.",
        type: "website",
        url: "/tools/clean-html",
    },
};

const Page = () => {
    return (
        <div className="flex flex-1 flex-col">
            <CleanHTMLTool />
        </div>
    );
};

export default Page;
