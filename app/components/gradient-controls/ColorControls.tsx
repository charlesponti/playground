import { Input } from "~/components/ui/input";

interface ColorControlsProps {
	colors: string[];
	onColorChange: (index: number, value: string) => void;
}

export function ColorControls({ colors, onColorChange }: ColorControlsProps) {
	return (
		<div className="space-y-4">
			{colors.map((color, index) => (
				<div key={`color-stop-${index}`} className="space-y-2">
					<label
						htmlFor={`color-${index}`}
						className="block text-sm font-medium"
					>
						Color Stop {index + 1}
					</label>
					<div className="flex gap-2">
						<Input
							id={`color-${index}`}
							type="color"
							value={color}
							onChange={(e) => onColorChange(index, e.target.value)}
							className="w-12 h-10"
						/>
						<Input
							type="text"
							value={color}
							onChange={(e) => onColorChange(index, e.target.value)}
							placeholder="#ffffff"
						/>
					</div>
				</div>
			))}
		</div>
	);
}
