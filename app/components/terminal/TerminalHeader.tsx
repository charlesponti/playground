import { memo } from "react";
import { ASCII_LOGO } from "./constants";
import styles from "../../routes/home.module.css";

export const TerminalHeader = memo(() => (
	<div className={styles.terminalHeader}>
		<div className={styles.asciiArt}>{ASCII_LOGO}</div>
	</div>
));

TerminalHeader.displayName = "TerminalHeader";
