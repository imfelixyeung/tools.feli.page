import Link from "next/link";

const tools = [
    {
        name: "Clean HTML",
        description: "Paste HTML and get back clean, formatted code.",
        href: "/tools/clean-html",
    },
    {
        name: "Clipboard Inspector",
        description: "Inspect everything currently on your clipboard.",
        href: "/tools/clipboard-inspector",
    },
] as const;

const Home = () => {
    return (
        <div className="flex flex-col items-center p-8">
            <h1 className="text-4xl font-bold mb-2">tools.feli.page</h1>
            <p className="text-base-content/60 mb-8">
                A collection of useful web developer tools
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-3xl">
                {tools.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="card bg-base-200 hover:bg-base-300 transition-colors"
                    >
                        <div className="card-body">
                            <h2 className="card-title">{tool.name}</h2>
                            <p>{tool.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
