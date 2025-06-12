import { memo, forwardRef } from "react";
import styles from "../../routes/home.module.css";

interface TerminalInputProps {
	currentCommand: string;
	onCommandChange: (value: string) => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
}

export const TerminalInput = memo(
	forwardRef<HTMLInputElement, TerminalInputProps>(
		({ currentCommand, onCommandChange, onKeyDown }, ref) => (
			<div className={styles.terminalLine}>
				<span className={styles.prompt}>C:\CHUCK&gt; </span>
				<span className={styles.inputWrapper}>
					<input
						ref={ref}
						type="text"
						value={currentCommand}
						onChange={(e) => onCommandChange(e.target.value)}
						onKeyDown={onKeyDown}
						className={styles.commandInput}
						autoComplete="off"
						spellCheck="false"
					/>
					<span className={styles.cursor}>_</span>
				</span>
			</div>
		),
	),
);

TerminalInput.displayName = "TerminalInput";
