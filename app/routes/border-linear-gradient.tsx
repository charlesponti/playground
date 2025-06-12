import * as React from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import styles from "./border-linear-gradient.module.css";
import { cn } from "~/lib/utils";
import { useLoaderData } from "react-router";
import {
	BackgroundSettings,
	GradientAngle,
	BorderWidth,
	ColorControls,
	OpacityControls,
	PositionControls,
	GlassBackgroundControls,
} from "~/components/gradient-controls";
import {
	GradientSettingsSchema,
	type GradientSettings,
	defaultSettings,
	encodeSettings,
	decodeSettings,
} from "~/lib/gradient";

export async function loader() {
	return {
		defaultSettings,
	};
}

export default function Component() {
	const { defaultSettings } = useLoaderData<typeof loader>();

	const [degree, setDegree] = React.useState(defaultSettings.degree);
	const [opacities, setOpacities] = React.useState(defaultSettings.opacities);
	const [positions, setPositions] = React.useState(defaultSettings.positions);
	const [colors, setColors] = React.useState(defaultSettings.colors);
	const [borderWidth, setBorderWidth] = React.useState(
		defaultSettings.borderWidth,
	);
	const [backgroundImage, setBackgroundImage] = React.useState(
		defaultSettings.backgroundImage,
	);
	const [backgroundColor, setBackgroundColor] = React.useState(
		defaultSettings.backgroundColor,
	);
	const [glassGradient, setGlassGradient] = React.useState(
		defaultSettings.glassGradient,
	);
	const [shareSuccess, setShareSuccess] = React.useState(false);

	React.useEffect(() => {
		const hash = window.location.hash.slice(1);
		if (hash) {
			const decodedSettings = decodeSettings(hash);
			if (decodedSettings) {
				// Apply only the valid decoded settings, keeping defaults for missing values
				if (decodedSettings.degree !== undefined)
					setDegree(decodedSettings.degree);
				if (decodedSettings.opacities !== undefined)
					setOpacities(decodedSettings.opacities);
				if (decodedSettings.positions !== undefined)
					setPositions(decodedSettings.positions);
				if (decodedSettings.colors !== undefined)
					setColors(decodedSettings.colors);
				if (decodedSettings.borderWidth !== undefined)
					setBorderWidth(decodedSettings.borderWidth);
				if (decodedSettings.backgroundImage !== undefined)
					setBackgroundImage(decodedSettings.backgroundImage);
				if (decodedSettings.backgroundColor !== undefined)
					setBackgroundColor(decodedSettings.backgroundColor);
				if (decodedSettings.glassGradient !== undefined)
					setGlassGradient(decodedSettings.glassGradient);
			}
		}
	}, []);

	const presetAngles = React.useMemo(() => [25, 130, 225, 360], []);

	const clearUrlHash = React.useCallback(() => {
		if (window.location.hash) {
			window.history.replaceState(null, "", window.location.pathname);
		}
	}, []);

	const resetToDefaults = React.useCallback(() => {
		setDegree(defaultSettings.degree);
		setOpacities(defaultSettings.opacities);
		setPositions(defaultSettings.positions);
		setColors(defaultSettings.colors);
		setBorderWidth(defaultSettings.borderWidth);
		setBackgroundImage(defaultSettings.backgroundImage);
		setBackgroundColor(defaultSettings.backgroundColor);
		setGlassGradient(defaultSettings.glassGradient);
		clearUrlHash();
	}, [defaultSettings, clearUrlHash]);

	const handleOpacityChange = React.useCallback(
		(index: number, value: number) => {
			const newOpacities = [...opacities];
			newOpacities[index] = value / 100;
			setOpacities(newOpacities);
			clearUrlHash();
		},
		[opacities, clearUrlHash],
	);

	const handlePositionChange = React.useCallback(
		(index: number, value: number) => {
			const newPositions = [...positions];
			newPositions[index] = value;
			setPositions(newPositions);
			clearUrlHash();
		},
		[positions, clearUrlHash],
	);

	const handleColorChange = React.useCallback(
		(index: number, value: string) => {
			const newColors = [...colors];
			newColors[index] = value;
			setColors(newColors);
			clearUrlHash();
		},
		[colors, clearUrlHash],
	);

	const hexToRgba = React.useCallback((hex: string, opacity: number) => {
		const r = Number.parseInt(hex.slice(1, 3), 16);
		const g = Number.parseInt(hex.slice(3, 5), 16);
		const b = Number.parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}, []);

	const gradientString = React.useMemo(() => {
		return `linear-gradient(
    ${degree}deg, 
    ${hexToRgba(colors[0], opacities[0])} ${positions[0]}%,
    ${hexToRgba(colors[1], opacities[1])} ${positions[1]}%,
    ${hexToRgba(colors[2], opacities[2])} ${positions[2]}%,
    ${hexToRgba(colors[3], opacities[3])} ${positions[3]}%
  )`;
	}, [degree, colors, opacities, positions, hexToRgba]);

	const glassGradientString = React.useMemo(() => {
		const startRgba = hexToRgba(
			glassGradient.startColor,
			glassGradient.startOpacity,
		);
		const endRgba = hexToRgba(glassGradient.endColor, glassGradient.endOpacity);
		return `linear-gradient(${glassGradient.direction}, ${startRgba}, ${endRgba})`;
	}, [glassGradient, hexToRgba]);

	const backgroundStyle = React.useMemo(
		() => ({
			backgroundColor,
			backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
			backgroundSize: "cover",
			backgroundPosition: "center",
		}),
		[backgroundColor, backgroundImage],
	);

	const generateCSSString = React.useCallback(() => {
		const glassStartRgba = hexToRgba(
			glassGradient.startColor,
			glassGradient.startOpacity,
		);
		const glassEndRgba = hexToRgba(
			glassGradient.endColor,
			glassGradient.endOpacity,
		);

		return `.gradientBorder {
  background: linear-gradient(
    ${glassGradient.direction}, 
    ${glassStartRgba}, 
    ${glassEndRgba}
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
	}, [borderWidth, gradientString, glassGradient, hexToRgba]);

	const copyToClipboard = React.useCallback(async () => {
		try {
			await navigator.clipboard.writeText(generateCSSString());
		} catch (err) {
			console.error("Failed to copy CSS:", err);
		}
	}, [generateCSSString]);

	const handleBackgroundImageChange = React.useCallback(
		(value: string) => {
			setBackgroundImage(value);
			clearUrlHash();
		},
		[clearUrlHash],
	);

	const handleBackgroundColorChange = React.useCallback(
		(value: string) => {
			setBackgroundColor(value);
			clearUrlHash();
		},
		[clearUrlHash],
	);

	const handleDegreeChange = React.useCallback(
		(value: number) => {
			setDegree(value);
			clearUrlHash();
		},
		[clearUrlHash],
	);

	const handleBorderWidthChange = React.useCallback(
		(value: number) => {
			setBorderWidth(value);
			clearUrlHash();
		},
		[clearUrlHash],
	);

	const handleGlassGradientChange = React.useCallback(
		(gradient: typeof glassGradient) => {
			setGlassGradient(gradient);
			clearUrlHash();
		},
		[clearUrlHash],
	);

	const onShareClick = React.useCallback(() => {
		const currentSettings: GradientSettings = {
			degree,
			opacities,
			positions,
			colors,
			borderWidth,
			backgroundImage,
			backgroundColor,
			glassGradient,
		};

		const encodedSettings = encodeSettings(currentSettings);
		if (encodedSettings) {
			const shareUrl = `${window.location.origin}${window.location.pathname}#${encodedSettings}`;

			navigator.clipboard
				.writeText(shareUrl)
				.then(() => {
					setShareSuccess(true);
					setTimeout(() => setShareSuccess(false), 3000);
				})
				.catch((err) => {
					console.error("Failed to copy share URL:", err);
				});
		}
	}, [
		backgroundColor,
		backgroundImage,
		borderWidth,
		colors,
		degree,
		glassGradient,
		opacities,
		positions,
	]);
	return (
		<div className="pt-4">
			<div className="max-w-7xl mx-auto mt-6">
				<div className="space-y-8 p-4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
					<div className="space-y-4">
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
										"--glass-background-gradient": glassGradientString,
									} as React.CSSProperties
								}
							>
								Gradient Border Demo
							</div>
						</Card>
						<Card className="p-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold">Generated CSS</h3>
									<div className="flex gap-2">
										<Button
											onClick={onShareClick}
											variant="outline"
											size="sm"
											className={
												shareSuccess ? "bg-green-100 border-green-300" : ""
											}
										>
											{shareSuccess ? "URL Copied!" : "Share Settings"}
										</Button>
										<Button
											onClick={resetToDefaults}
											variant="outline"
											size="sm"
										>
											Reset
										</Button>
										<Button
											onClick={copyToClipboard}
											variant="outline"
											size="sm"
										>
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

					<Card className="space-y-4 px-4">
						<Accordion type="single" collapsible defaultValue="background">
							<AccordionItem value="background">
								<AccordionTrigger>Background Settings</AccordionTrigger>
								<AccordionContent>
									<BackgroundSettings
										backgroundImage={backgroundImage}
										backgroundColor={backgroundColor}
										onBackgroundImageChange={handleBackgroundImageChange}
										onBackgroundColorChange={handleBackgroundColorChange}
									/>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="angle">
								<AccordionTrigger>Gradient Angle</AccordionTrigger>
								<AccordionContent>
									<GradientAngle
										degree={degree}
										presetAngles={presetAngles}
										onDegreeChange={handleDegreeChange}
									/>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="border-width">
								<AccordionTrigger>Border Width</AccordionTrigger>
								<AccordionContent>
									<BorderWidth
										borderWidth={borderWidth}
										onBorderWidthChange={handleBorderWidthChange}
									/>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="colors">
								<AccordionTrigger>Color Controls</AccordionTrigger>
								<AccordionContent>
									<ColorControls
										colors={colors}
										onColorChange={handleColorChange}
									/>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="opacity">
								<AccordionTrigger>Opacity Controls</AccordionTrigger>
								<AccordionContent>
									<OpacityControls
										opacities={opacities}
										onOpacityChange={handleOpacityChange}
									/>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="position">
								<AccordionTrigger>Position Controls</AccordionTrigger>
								<AccordionContent>
									<PositionControls
										positions={positions}
										onPositionChange={handlePositionChange}
									/>
								</AccordionContent>
							</AccordionItem>

							{/* Glass Background Controls */}
							<AccordionItem value="glass-background">
								<AccordionTrigger>Glass Background</AccordionTrigger>
								<AccordionContent>
									<GlassBackgroundControls
										glassGradient={glassGradient}
										onGlassGradientChange={handleGlassGradientChange}
									/>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</Card>
				</div>
			</div>
		</div>
	);
}
