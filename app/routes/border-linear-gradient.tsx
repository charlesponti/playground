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

// Types for our settings
interface GradientSettings {
	degree: number;
	opacities: number[];
	positions: number[];
	colors: string[];
	borderWidth: number;
	backgroundImage: string;
	backgroundColor: string;
}

// Utility functions for URL sharing
const encodeSettings = (settings: GradientSettings): string => {
	try {
		const jsonString = JSON.stringify(settings);
		return btoa(jsonString);
	} catch (error) {
		console.error("Failed to encode settings:", error);
		return "";
	}
};

const decodeSettings = (hash: string): GradientSettings | null => {
	try {
		const jsonString = atob(hash);
		const settings = JSON.parse(jsonString);
		
		// Validate the settings structure
		if (
			typeof settings.degree === "number" &&
			Array.isArray(settings.opacities) &&
			Array.isArray(settings.positions) &&
			Array.isArray(settings.colors) &&
			typeof settings.borderWidth === "number" &&
			typeof settings.backgroundImage === "string" &&
			typeof settings.backgroundColor === "string"
		) {
			return settings;
		}
		return null;
	} catch (error) {
		console.error("Failed to decode settings:", error);
		return null;
	}
};

export default function Component() {
	// Default settings for reset functionality
	const defaultSettings: GradientSettings = {
		degree: 130,
		opacities: [0.8, 0.5, 0.4, 0.1],
		positions: [0, 25, 50, 100],
		colors: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
		borderWidth: 2,
		backgroundImage: "https://images.unsplash.com/photo-1530092285049-1c42085fd395?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmxvd2VyJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww",
		backgroundColor: "#000000",
	};

	// State for gradient properties
	const [degree, setDegree] = React.useState(defaultSettings.degree);
	const [opacities, setOpacities] = React.useState(defaultSettings.opacities);
	const [positions, setPositions] = React.useState(defaultSettings.positions);
	const [colors, setColors] = React.useState(defaultSettings.colors);
	const [borderWidth, setBorderWidth] = React.useState(defaultSettings.borderWidth);
	const [backgroundImage, setBackgroundImage] = React.useState(defaultSettings.backgroundImage);
	const [backgroundColor, setBackgroundColor] = React.useState(defaultSettings.backgroundColor);
	const [shareSuccess, setShareSuccess] = React.useState(false);

	// Preset angles
	const presetAngles = [25, 130, 225, 360];

	// Load settings from URL hash on component mount
	React.useEffect(() => {
		const hash = window.location.hash.slice(1); // Remove the # character
		if (hash) {
			const decodedSettings = decodeSettings(hash);
			if (decodedSettings) {
				setDegree(decodedSettings.degree);
				setOpacities(decodedSettings.opacities);
				setPositions(decodedSettings.positions);
				setColors(decodedSettings.colors);
				setBorderWidth(decodedSettings.borderWidth);
				setBackgroundImage(decodedSettings.backgroundImage);
				setBackgroundColor(decodedSettings.backgroundColor);
			}
		}
	}, []);

	// Function to share current settings
	const shareSettings = () => {
		const currentSettings: GradientSettings = {
			degree,
			opacities,
			positions,
			colors,
			borderWidth,
			backgroundImage,
			backgroundColor,
		};
		
		const encodedSettings = encodeSettings(currentSettings);
		if (encodedSettings) {
			const shareUrl = `${window.location.origin}${window.location.pathname}#${encodedSettings}`;
			
			// Copy to clipboard
			navigator.clipboard.writeText(shareUrl).then(() => {
				setShareSuccess(true);
				setTimeout(() => setShareSuccess(false), 3000); // Hide after 3 seconds
			}).catch((err) => {
				console.error("Failed to copy share URL:", err);
			});
		}
	};

	// Function to reset to default settings
	const resetToDefaults = () => {
		setDegree(defaultSettings.degree);
		setOpacities(defaultSettings.opacities);
		setPositions(defaultSettings.positions);
		setColors(defaultSettings.colors);
		setBorderWidth(defaultSettings.borderWidth);
		setBackgroundImage(defaultSettings.backgroundImage);
		setBackgroundColor(defaultSettings.backgroundColor);
		// Clear the URL hash
		window.history.replaceState(null, "", window.location.pathname);
	};

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

	// Update a specific color value
	const handleColorChange = (index: number, value: string) => {
		const newColors = [...colors];
		newColors[index] = value;
		setColors(newColors);
	};

	// Convert hex color to rgba
	const hexToRgba = (hex: string, opacity: number) => {
		const r = Number.parseInt(hex.slice(1, 3), 16);
		const g = Number.parseInt(hex.slice(3, 5), 16);
		const b = Number.parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	};

	// Generate the gradient string based on current values
	const gradientString = `linear-gradient(
    ${degree}deg, 
    ${hexToRgba(colors[0], opacities[0])} ${positions[0]}%,
    ${hexToRgba(colors[1], opacities[1])} ${positions[1]}%,
    ${hexToRgba(colors[2], opacities[2])} ${positions[2]}%,
    ${hexToRgba(colors[3], opacities[3])} ${positions[3]}%
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
		<div className="pt-4">
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
									<div className="flex gap-2">
										<Button 
											onClick={shareSettings} 
											variant="outline" 
											size="sm"
											className={shareSuccess ? "bg-green-100 border-green-300" : ""}
										>
											{shareSuccess ? "URL Copied!" : "Share Settings"}
										</Button>
										<Button onClick={resetToDefaults} variant="outline" size="sm">
											Reset
										</Button>
										<Button onClick={copyToClipboard} variant="outline" size="sm">
											Copy CSS
										</Button>
									</div>
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

							{/* Color Controls */}
							<AccordionItem value="colors">
								<AccordionTrigger>Color Controls</AccordionTrigger>
								<AccordionContent>
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
														onChange={(e) =>
															handleColorChange(index, e.target.value)
														}
														className="w-12 h-10"
													/>
													<Input
														type="text"
														value={color}
														onChange={(e) =>
															handleColorChange(index, e.target.value)
														}
														placeholder="#ffffff"
													/>
												</div>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							{/* Opacity Controls */}
							<AccordionItem value="opacity">
								<AccordionTrigger>Opacity Controls</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-4">
										{opacities.map((opacity, index) => (
											<div key={`opacity-stop-${index}`} className="space-y-2">
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
											<div key={`position-stop-${index}`} className="space-y-2">
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
