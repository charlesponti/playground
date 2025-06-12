import type { Route } from "./+types/home";
import { Terminal } from "../components/terminal";

export function meta(): Array<{
	title?: string;
	name?: string;
	content?: string;
}> {
	return [
		{ title: "CHUCK.EXE - MSDOS Code Playground" },
		{
			name: "description",
			content:
				"Chuck's retro MSDOS terminal - Enter commands to explore the playground!",
		},
	];
}

export default function Home() {
	return (
		<div className="flex flex-col h-full pt-0">
			<Terminal />
		</div>
	);
}
