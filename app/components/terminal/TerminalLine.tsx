import { memo } from "react";
import type { TerminalLine as TerminalLineType } from "./types";
import styles from "../../routes/home.module.css";

interface TerminalLineProps {
	line: TerminalLineType;
	index: number;
}

export const TerminalLine = memo(({ line, index }: TerminalLineProps) => (
	<div
		key={`line-${index}-${line.content.slice(0, 10)}`}
		className={`${styles.terminalLine} ${
			line.type === "command"
				? styles.command
				: line.type === "error"
					? styles.error
					: line.type === "system"
						? styles.systemInfo
						: styles.output
		}`}
	>
		{line.content}
	</div>
));

TerminalLine.displayName = "TerminalLine";
