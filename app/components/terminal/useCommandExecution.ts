import { useCallback } from "react";
import { useNavigate } from "react-router";
import type { TerminalLine } from "./types";
import { ASCII_LOGO, CYBER_SKULLS, MATRIX_EFFECT } from "./constants";

export function useCommandExecution() {
  const navigate = useNavigate();

  const executeCommand = useCallback(
    (
      cmd: string,
      commandHistory: string[],
      setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>,
      setCommandHistory: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
      const command = cmd.trim().toLowerCase();

      // Add command to history
      if (command && !commandHistory.includes(command)) {
        setCommandHistory((prev) => [...prev, command]);
      }

      // Add command line to output
      setLines((prev) => [
        ...prev,
        {
          type: "command",
          content: `C:\\CHUCK> ${cmd}`,
        },
      ]);

      // Process command
      switch (command) {
        case "help":
          setLines((prev) => [
            ...prev,
            { type: "output", content: "║ AVAILABLE COMMANDS ║" },
            { type: "output", content: "╠════════════════════╣" },
            {
              type: "output",
              content: "║ HELP        - Show this help message",
            },
            {
              type: "output",
              content: "║ DIR         - List available projects",
            },
            { type: "output", content: "║ CLS         - Clear screen" },
            { type: "output", content: "║ VER         - Show system version" },
            { type: "output", content: "║ TIME        - Show current time" },
            {
              type: "output",
              content: "║ GRADIENT    - Launch gradient border lab",
            },
            {
              type: "output",
              content: "║ GLASS       - Launch SVG glass effects",
            },
            { type: "output", content: "║ MATRIX      - Enter the Matrix" },
            {
              type: "output",
              content: "║ HACK        - Initiate cyber sequence",
            },
            { type: "output", content: "║ NEON        - Toggle neon mode" },
            { type: "output", content: "║ SKULL       - Display cyber skulls" },
            { type: "output", content: "║ ABOUT       - About this system" },
            { type: "output", content: "║ EXIT        - Shut down system" },
            { type: "output", content: "╚════════════════════╝" },
            { type: "output", content: "" },
          ]);
          break;

        case "dir":
          setLines((prev) => [
            ...prev,
            { type: "output", content: "Directory of C:\\CHUCK\\PROJECTS" },
            { type: "output", content: "" },
            {
              type: "output",
              content:
                "GRADIENT.EXE    1,024 bytes  Gradient Border Laboratory",
            },
            {
              type: "output",
              content: "GLASS.EXE       2,048 bytes  SVG Glass Effects Studio",
            },
            {
              type: "output",
              content: "TERMINAL.EXE    4,096 bytes  This Terminal Interface",
            },
            { type: "output", content: "" },
            { type: "output", content: "        3 File(s)     7,168 bytes" },
            {
              type: "output",
              content: "        0 Dir(s)    999,999 bytes free",
            },
            { type: "output", content: "" },
          ]);
          break;

        case "cls":
          setLines([]);
          break;

        case "ver":
          setLines((prev) => [
            ...prev,
            { type: "output", content: "CHUCK-DOS Version 2.025" },
            { type: "output", content: "Powered by React Router v7 & Vite" },
            { type: "output", content: "" },
          ]);
          break;

        case "time": {
          const now = new Date();
          setLines((prev) => [
            ...prev,
            {
              type: "output",
              content: `Current time is ${now.toLocaleTimeString()}`,
            },
            {
              type: "output",
              content: `Current date is ${now.toLocaleDateString()}`,
            },
            { type: "output", content: "" },
          ]);
          break;
        }

        case "gradient":
          setLines((prev) => [
            ...prev,
            {
              type: "output",
              content: "Launching Gradient Border Laboratory...",
            },
            { type: "output", content: "Loading GRADIENT.EXE..." },
            { type: "output", content: "" },
          ]);
          setTimeout(() => navigate("/border-linear-gradient"), 1500);
          break;

        case "glass":
          setLines((prev) => [
            ...prev,
            {
              type: "output",
              content: "Launching SVG Glass Effects Studio...",
            },
            { type: "output", content: "Loading GLASS.EXE..." },
            { type: "output", content: "" },
          ]);
          setTimeout(() => navigate("/svg-glass-test"), 1500);
          break;

        case "about":
          setLines((prev) => [
            ...prev,
            { type: "output", content: ASCII_LOGO },
            { type: "output", content: "" },
            { type: "output", content: "Welcome to Chuck's Code Laboratory!" },
            {
              type: "output",
              content: "A radical digital playground for web experiments.",
            },
            { type: "output", content: "" },
            { type: "output", content: "Built with modern web technologies:" },
            { type: "output", content: "• React Router v7" },
            { type: "output", content: "• TypeScript" },
            { type: "output", content: "• Vite" },
            { type: "output", content: "• Tailwind CSS" },
            { type: "output", content: "" },
            { type: "output", content: "Created by Chuck Ponti - Est. 2025" },
            { type: "output", content: "" },
          ]);
          break;

        case "matrix":
          setLines((prev) => [
            ...prev,
            { type: "output", content: "Initiating Matrix protocol..." },
            { type: "output", content: "" },
          ]);
          // Add Matrix quotes with delays
          MATRIX_EFFECT.forEach((quote, index) => {
            setTimeout(() => {
              setLines((prev) => [
                ...prev,
                { type: "system", content: `>> ${quote}` },
              ]);
            }, (index + 1) * 1000);
          });
          setTimeout(() => {
            setLines((prev) => [
              ...prev,
              { type: "output", content: "" },
              {
                type: "output",
                content: "Connection to Matrix... ESTABLISHED",
              },
              { type: "output", content: "" },
            ]);
          }, MATRIX_EFFECT.length * 1000 + 500);
          break;

        case "hack": {
          setLines((prev) => [
            ...prev,
            { type: "output", content: "Initiating cyber hack sequence..." },
            { type: "output", content: "Scanning network..." },
          ]);
          const hackSequence = [
            "Bypassing firewall... [████████████] 100%",
            "Cracking encryption... [████████████] 100%",
            "Accessing mainframe... [████████████] 100%",
            "Downloading data... [████████████] 100%",
            "Covering tracks... [████████████] 100%",
            "HACK SUCCESSFUL - ACCESS GRANTED",
          ];
          hackSequence.forEach((step, index) => {
            setTimeout(() => {
              setLines((prev) => [...prev, { type: "system", content: step }]);
            }, (index + 1) * 800);
          });
          setTimeout(() => {
            setLines((prev) => [...prev, { type: "output", content: "" }]);
          }, hackSequence.length * 800 + 500);
          break;
        }

        case "skull":
          setLines((prev) => [
            ...prev,
            { type: "output", content: CYBER_SKULLS },
            { type: "output", content: "" },
            { type: "output", content: "CYBER TERMINAL ACTIVATED" },
            { type: "output", content: "Security level: MAXIMUM" },
            { type: "output", content: "" },
          ]);
          break;

        case "neon":
          setLines((prev) => [
            ...prev,
            { type: "output", content: "Activating NEON mode..." },
            { type: "output", content: "▓▓▓▓▓▓▓▓▓▓ NEON ACTIVATED ▓▓▓▓▓▓▓▓▓▓" },
            {
              type: "output",
              content: "Visual enhancement protocols engaged.",
            },
            { type: "output", content: "" },
          ]);
          break;

        case "exit":
          setLines((prev) => [
            ...prev,
            {
              type: "output",
              content: "Thank you for visiting Chuck's Code Lab!",
            },
            { type: "output", content: "System shutting down..." },
            { type: "output", content: "" },
          ]);
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.close();
            }
          }, 2000);
          break;

        case "":
          // Empty command, just show prompt
          break;

        default:
          setLines((prev) => [
            ...prev,
            { type: "error", content: `Bad command or file name: ${cmd}` },
            { type: "error", content: "Access denied. Unauthorized command." },
            { type: "output", content: "Type HELP for available commands." },
            { type: "output", content: "" },
          ]);
      }
    },
    [navigate]
  );

  return { executeCommand };
}
