import { Link, useLocation } from "react-router";
import { useState } from "react";

const routes = [
	{
		path: "/border-linear-gradient",
		label: "Border Gradient",
		description: "CSS border gradient effects",
	},
	{
		path: "/svg-glass-test",
		label: "Glass Effect",
		description: "SVG glass displacement filter",
	},
];

export default function Navigation() {
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();

	const isActiveRoute = (path: string) => {
		if (path === "/") {
			return location.pathname === "/";
		}
		return location.pathname === path;
	};

	return (
		<nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Logo/Brand */}
					<div className="flex items-center">
						<Link
							to="/"
							className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
						>
							<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">P</span>
							</div>
							<span>Playground</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{routes.map((route) => (
							<Link
								key={route.path}
								to={route.path}
								className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
									isActiveRoute(route.path)
										? "bg-blue-100 text-blue-700"
										: "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
								}`}
								title={route.description}
							>
								{route.label}
							</Link>
						))}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center">
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
							aria-expanded="false"
						>
							<span className="sr-only">Open main menu</span>
							{/* Hamburger icon */}
							<svg
								className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
							{/* Close icon */}
							<svg
								className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation Menu */}
			<div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
				<div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-200/50">
					{routes.map((route) => (
						<Link
							key={route.path}
							to={route.path}
							onClick={() => setIsOpen(false)}
							className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
								isActiveRoute(route.path)
									? "bg-blue-100 text-blue-700"
									: "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
							}`}
						>
							<div>
								<div className="font-medium">{route.label}</div>
								<div className="text-sm text-gray-500 mt-1">
									{route.description}
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
