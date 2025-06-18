import { Link, useLocation } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const routes = [
	{
		path: "/",
		label: "Terminal",
		description: "Interactive terminal playground",
	},
	{
		path: "/border-linear-gradient",
		label: "Border Gradient",
		description: "CSS border gradient effects",
	},
	{
		path: "/tfl",
		label: "London Cameras",
		description: "Live traffic views",
	},
	{
		path: "/corona",
		label: "Corona Analytics",
		description: "COVID-19 data and insights",
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
		<nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
			<div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg px-6 py-3">
				<div className="flex justify-between items-center">
					{/* Logo/Brand */}
					<div className="flex items-center">
						<Link to="/" className="flex items-center space-x-3 group">
							<div className="w-8 h-8 bg-gradient-to-br from-olive-500 to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<span className="text-white font-serif font-medium text-sm">
									P
								</span>
							</div>
							<span className="font-serif text-lg font-medium text-stone-800 group-hover:text-olive-700 transition-colors duration-300 hidden sm:block">
								Playground
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						{routes.map((route) => (
							<Link
								key={route.path}
								to={route.path}
								className={`px-4 py-2 rounded-full text-sm font-light transition-all duration-300 ${
									isActiveRoute(route.path)
										? "bg-olive-100/80 text-olive-800 font-medium"
										: "text-stone-700 hover:bg-white/40 hover:text-stone-900"
								}`}
							>
								{route.label}
							</Link>
						))}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
							aria-label="Toggle menu"
						>
							<motion.svg
								className="w-5 h-5 text-stone-700"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
								animate={{ rotate: isOpen ? 45 : 0 }}
								transition={{ duration: 0.3, ease: "easeInOut" }}
							>
								{isOpen ? (
									<motion.path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.1 }}
									/>
								) : (
									<motion.path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.1 }}
									/>
								)}
							</motion.svg>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu - Outside of rounded container */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className="md:hidden mt-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-4"
						initial={{ opacity: 0, scale: 0.95, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -10 }}
						transition={{ 
							duration: 0.25, 
							ease: "easeOut"
						}}
					>
						<div className="flex flex-col space-y-2">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.1, duration: 0.3 }}
							>
								<Link
									to="/"
									onClick={() => setIsOpen(false)}
									className={`px-4 py-3 rounded-lg text-sm font-light transition-all duration-300 ${
										isActiveRoute("/")
											? "bg-olive-100/80 text-olive-800 font-medium"
											: "text-stone-700 hover:bg-white/40 hover:text-stone-900"
									}`}
								>
									<div className="flex flex-col">
										<span>Home</span>
										<span className="text-xs opacity-70">Welcome page</span>
									</div>
								</Link>
							</motion.div>
							{routes.map((route, index) => (
								<motion.div
									key={route.path}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1 + (index + 1) * 0.05, duration: 0.3 }}
								>
									<Link
										to={route.path}
										onClick={() => setIsOpen(false)}
										className={`px-4 py-3 rounded-lg text-sm font-light transition-all duration-300 ${
											isActiveRoute(route.path)
												? "bg-olive-100/80 text-olive-800 font-medium"
												: "text-stone-700 hover:bg-white/40 hover:text-stone-900"
										}`}
									>
										<div className="flex flex-col">
											<span>{route.label}</span>
											<span className="text-xs opacity-70">
												{route.description}
											</span>
										</div>
									</Link>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
