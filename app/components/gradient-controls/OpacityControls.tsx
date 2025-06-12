import { Slider } from "~/components/ui/slider";

interface OpacityControlsProps {
	opacities: number[];
	onOpacityChange: (index: number, value: number) => void;
}

export function OpacityControls({
	opacities,
	onOpacityChange,
}: OpacityControlsProps) {
	return (
		<div className="space-y-4">
			{opacities.map((opacity, index) => (
				<div key={`opacity-stop-${index}`} className="space-y-2">
					<label
						htmlFor={`opacity-${index}`}
						className="block text-sm font-medium"
					>
						Color Stop {index + 1} Opacity ({Math.round(opacity * 100)}%)
					</label>
					<Slider
						id={`opacity-${index}`}
						value={[opacity * 100]}
						onValueChange={(value) => onOpacityChange(index, value[0])}
						min={0}
						max={100}
						step={1}
					/>
				</div>
			))}
		</div>
	);
}
