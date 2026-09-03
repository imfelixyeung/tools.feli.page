"use client";

import { useForm } from "@tanstack/react-form";
import { gfm } from "@truto/turndown-plugin-gfm";
import html from "prettier/plugins/html";
import { format } from "prettier/standalone";
import sanitizeHtml from "sanitize-html";
import { Converter } from "showdown";
import TurndownService from "turndown";
import { z } from "zod";

const turndown = new TurndownService();
turndown.use(gfm);

const converter = new Converter({ tables: true });

export const CleanHTMLTool = () => {
    const form = useForm({
        defaultValues: {
            input: "",
            output: "",
        },
        validators: {
            onChange: z.object({
                input: z.string(),
                output: z.string(),
            }),
        },
        onSubmit: async ({ value }) => {
            const data = value.input;
            let output = data;
            output = output.replaceAll("\u200B", "");
            output = sanitizeHtml(output);
            output = turndown.turndown(output);
            output = converter.makeHtml(output);
            output = await format(output, {
                parser: "html",
                plugins: [html],
            });
            form.setFieldValue("output", output);
        },
    });

    const pasteFromClipboard = async () => {
        const data = await navigator.clipboard.read();
        const clipboardItem = data.find((d) => d.types.includes("text/html"));
        if (!clipboardItem) {
            return;
        }
        const html = await clipboardItem
            .getType("text/html")
            .then((blob) => blob.text());

        form.setFieldValue("input", html);
    };

    const copyToClipboard = async () => {
        const data = form.getFieldValue("output");
        await navigator.clipboard.write([
            new ClipboardItem({
                "text/plain": data,
                "text/html": data,
            }),
        ]);
    };

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="flex flex-1 flex-col gap-6 py-6"
            >
                <fieldset className="fieldset flex grow flex-col">
                    <legend className="fieldset-legend">Input</legend>
                    <form.Field name="input">
                        {(field) => (
                            <>
                                <textarea
                                    className="textarea w-full grow"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                                {!field.state.meta.isValid && (
                                    <em>{field.state.meta.errors.join(",")}</em>
                                )}
                            </>
                        )}
                    </form.Field>
                </fieldset>{" "}
                <button
                    className="btn"
                    type="button"
                    onClick={pasteFromClipboard}
                >
                    Paste from clipboard
                </button>
                <button className="btn" type="submit">
                    Convert
                </button>
                <fieldset className="fieldset flex grow flex-col">
                    <legend className="fieldset-legend">Output</legend>
                    <form.Field name="output">
                        {(field) => (
                            <>
                                <textarea
                                    className="textarea w-full grow"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                                {!field.state.meta.isValid && (
                                    <em>{field.state.meta.errors.join(",")}</em>
                                )}
                            </>
                        )}
                    </form.Field>
                </fieldset>
                <button className="btn" type="button" onClick={copyToClipboard}>
                    Copy to clipboard
                </button>
            </form>
        </div>
    );
};
