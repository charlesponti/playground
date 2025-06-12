import * as React from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import styles from "./border-linear-gradient.module.css";
import { cn } from "~/lib/utils";

export default function Component() {
	// State for gradient properties
	const [degree, setDegree] = React.useState(130);
	const [opacities, setOpacities] = React.useState([0.8, 0.5, 0.4, 0.1]);
	const [positions, setPositions] = React.useState([0, 25, 50, 100]);
	const [borderWidth, setBorderWidth] = React.useState(2);
	const [backgroundImage, setBackgroundImage] = React.useState(
		"https://images.unsplash.com/photo-1530092285049-1c42085fd395?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmxvd2VyJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww",
	);
	const [backgroundColor, setBackgroundColor] = React.useState("#000000");

	// Preset angles
	const presetAngles = [25, 130, 225, 360];

	// Update a specific opacity value
	const handleOpacityChange = (index: number, value: number) => {
		const newOpacities = [...opacities];
		newOpacities[index] = value / 100;
		setOpacities(newOpacities);
	};

	// Update a specific position value
	const handlePositionChange = (index: number, value: number) => {
		const newPositions = [...positions];
		newPositions[index] = value;
		setPositions(newPositions);
	};

	// Generate the gradient string based on current values
	const gradientString = `linear-gradient(
    ${degree}deg, 
    rgba(255, 255, 255, ${opacities[0]}) ${positions[0]}%,
    rgba(255, 255, 255, ${opacities[1]}) ${positions[1]}%,
    rgba(255, 255, 255, ${opacities[2]}) ${positions[2]}%,
    rgba(255, 255, 255, ${opacities[3]}) ${positions[3]}%
  )`;

	// Generate background style based on image and color
	const backgroundStyle = {
		backgroundColor,
		backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
		backgroundSize: "cover",
		backgroundPosition: "center",
	};

	// Generate the complete CSS string for copying
	const generateCSSString = () => {
		return `.gradientBorder {
  background: linear-gradient(
    to bottom right, 
    rgba(255, 255, 255, 0.1), 
    rgba(255, 255, 255, 0.05)
  );
  border-radius: 12px;
  position: relative;
  background-color: transparent;
  color: white;
  z-index: 1;
}

.gradientBorder::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: ${borderWidth}px;
  border-radius: inherit;
  background: ${gradientString};
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: xor;
  z-index: -1;
}`;
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generateCSSString());
		} catch (err) {
			console.error("Failed to copy CSS:", err);
		}
	};

	return (
		<div>
			<div className="max-w-7xl mx-auto mt-6">
				<div className="space-y-8 p-4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
					<div className="space-y-4">
						{/* Demo element with gradient border */}
						<Card
							className="p-8 flex justify-center max-h-fit"
							style={backgroundStyle}
						>
							<div
								className={cn(
									"gradient-border-outline p-8 text-xl",
									styles.gradientBorder,
								)}
								style={
									{
										"--gradient-border-gradient": gradientString,
										"--gradient-border-width": `${borderWidth}px`,
									} as React.CSSProperties
								}
							>
								Gradient Border Demo
							</div>
						</Card>
						{/* CSS Output Column */}
						<Card className="p-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold">Generated CSS</h3>
									<Button onClick={copyToClipboard} variant="outline" size="sm">
										Copy CSS
									</Button>
								</div>
								<div className="relative">
									<pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap">
										<code>{generateCSSString()}</code>
									</pre>
								</div>
							</div>
						</Card>
					</div>

					{/* Controls section */}
					<Card className="space-y-4 px-4">
						<Accordion type="single" collapsible defaultValue="background">
							{/* Background Settings */}
							<AccordionItem value="background">
								<AccordionTrigger>Background Settings</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-4">
										<div className="space-y-2">
											<label
												htmlFor="background-image"
												className="block text-sm font-medium"
											>
												Background Image URL
											</label>
											<Input
												id="background-image"
												type="url"
												value={backgroundImage}
												onChange={(e) => setBackgroundImage(e.target.value)}
												placeholder="Enter image URL..."
											/>
										</div>
										<div className="space-y-2">
											<label
												htmlFor="background-color"
												className="block text-sm font-medium"
											>
												Background Color
											</label>
											<div className="flex gap-2">
												<Input
													id="background-color"
													type="color"
													value={backgroundColor}
													onChange={(e) => setBackgroundColor(e.target.value)}
													className="w-12 h-10"
												/>
												<Input
													type="text"
													value={backgroundColor}
													onChange={(e) => setBackgroundColor(e.target.value)}
													placeholder="#000000"
												/>
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>

							{/* Gradient Angle */}
							<AccordionItem value="angle">
								<AccordionTrigger>Gradient Angle</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2">
										<label
											htmlFor="gradient-angle"
											className="block text-sm font-medium"
										>
											Gradient Angle (degrees)
										</label>
										<div className="flex gap-4 items-center">
											<Input
												id="gradient-angle"
												type="number"
												value={degree}
												onChange={(e) => setDegree(Number(e.target.value))}
												min="0"
												max="360"
												className="w-24"
											/>
											<div className="flex gap-2">
												{presetAngles.map((angle) => (
													<Button
														key={angle}
														variant="secondary"
														onClick={() => setDegree(angle)}
													>
														{angle}°
													</Button>
												))}
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>

							{/* Border Width */}
							<AccordionItem value="border-width">
								<AccordionTrigger>Border Width</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2">
										<label
											htmlFor="border-width"
											className="block text-sm font-medium"
										>
											Border Width ({borderWidth}px)
										</label>
										<Slider
											id="border-width"
											value={[borderWidth]}
											onValueChange={(value) => setBorderWidth(value[0])}
											min={1}
											max={20}
											step={1}
										/>
									</div>
								</AccordionContent>
							</AccordionItem>

							{/* Opacity Controls */}
							<AccordionItem value="opacity">
								<AccordionTrigger>Opacity Controls</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-4">
										{opacities.map((opacity, index) => (
											<div key={`opacity-${index}`} className="space-y-2">
												<label
													htmlFor={`opacity-${index}`}
													className="block text-sm font-medium"
												>
													Color Stop {index + 1} Opacity (
													{Math.round(opacity * 100)}%)
												</label>
												<Slider
													id={`opacity-${index}`}
													value={[opacity * 100]}
													onValueChange={(value) =>
														handleOpacityChange(index, value[0])
													}
													min={0}
													max={100}
													step={1}
												/>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							{/* Position Controls */}
							<AccordionItem value="position">
								<AccordionTrigger>Position Controls</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-4">
										{positions.map((position, index) => (
											<div key={`position-${index}`} className="space-y-2">
												<label
													htmlFor={`position-${index}`}
													className="block text-sm font-medium"
												>
													Color Stop {index + 1} Position ({position}%)
												</label>
												<Slider
													id={`position-${index}`}
													value={[position]}
													onValueChange={(value) =>
														handlePositionChange(index, value[0])
													}
													min={0}
													max={100}
													step={1}
												/>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</Card>
				</div>
			</div>
		</div>
	);
}
