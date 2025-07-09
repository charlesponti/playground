import { Terminal } from "../components/terminal";
import type { Route } from "./+types/home";

export function meta(): Array<{
	title?: string;
	name?: string;
	content?: string;
}> {
	return [
		{ title: "Terminal — Interactive Playground" },
		{
			name: "description",
			content:
				"Experience our elegant terminal interface designed for modern exploration and interaction.",
		},
	];
}

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100">
			{/* Hero Section */}
			<div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto space-y-4">
					{/* Terminal Container */}
					<div className="relative bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/50 overflow-hidden">
						<div className="h-[60vh] max-h-[600px] min-h-[400px]">
							<Terminal />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
