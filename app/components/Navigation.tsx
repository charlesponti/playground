import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router";

interface NavigationProps {
	toggleSidebar: () => void;
}

export default function Navigation({ toggleSidebar }: NavigationProps) {
	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/30 shadow-sm">
			<div className="max-w-7xl mx-auto p-2 lg:px-8">
					<div className="flex items-center space-x-2">
						{/* Sidebar Toggle - Only visible on mobile */}
						<button
							type="button"
							onClick={toggleSidebar}
							className="md:hidden p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-200 border border-white/30"
							aria-label="Toggle sidebar"
						>
							<motion.svg
								className="w-5 h-5 text-stone-700"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</motion.svg>
						</button>

						{/* Logo/Brand */}
						<Link to="/" className="flex items-center space-x-3 group">
							<span className="font-serif text-lg font-medium text-stone-800 group-hover:text-olive-700 transition-colors duration-200">
								Playground
							</span>
						</Link>
					</div>
			</div>
		</nav>
	);
}
