import { AlertTriangle, ExternalLink, Key, CreditCard } from "lucide-react";
import ApiKeyTester from "./ApiKeyTester";

export default function GoogleMapsHelp() {
	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="bg-white/60 backdrop-blur-sm border border-stone-200/50 rounded-3xl shadow-xl p-8 lg:p-12">
				<div className="flex items-center mb-8">
					<div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
						<AlertTriangle className="text-amber-700" size={24} />
					</div>
					<h1 className="font-serif text-3xl lg:text-4xl font-light text-stone-900">
						Maps Configuration Required
					</h1>
				</div>

				<p className="text-stone-600 mb-12 text-lg lg:text-xl font-light leading-relaxed">
					To experience the full beauty of our London camera collection, you'll
					need to configure a Google Maps API key. Follow these elegant steps:
				</p>

				<div className="space-y-8 lg:space-y-12">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-stone-200/30">
						<div className="flex items-center mb-6">
							<div className="w-10 h-10 bg-olive-100 rounded-full flex items-center justify-center mr-4">
								<Key className="text-olive-700" size={20} />
							</div>
							<h2 className="font-serif text-xl lg:text-2xl font-medium text-stone-900">
								Step 1: Obtain Your API Key
							</h2>
						</div>
						<div className="space-y-4 text-stone-600 font-light leading-relaxed">
							<p>1. Visit the Google Cloud Console</p>
							<a
								href="https://console.cloud.google.com/apis/credentials"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center text-olive-700 hover:text-olive-800 font-medium transition-colors duration-300"
							>
								Open Google Cloud Console
								<ExternalLink size={16} className="ml-2" />
							</a>
							<p>2. Create a new project or select an existing one</p>
							<p>3. Click "Create Credentials" → "API Key"</p>
							<p>4. Copy your newly generated API key</p>
						</div>
					</div>

					<div className="bg-white rounded-lg p-6 shadow-sm border">
						<div className="flex items-center mb-4">
							<CreditCard className="text-green-500 mr-3" size={24} />
							<h2 className="text-xl font-semibold text-gray-900">
								Step 2: Enable Required APIs & Billing
							</h2>
						</div>
						<div className="space-y-3 text-gray-700">
							<p>
								1. In the Google Cloud Console, go to "APIs & Services" →
								"Library"
							</p>
							<p>2. Search for and enable "Maps JavaScript API"</p>
							<p>3. Enable billing for your project (required for Maps API)</p>
							<a
								href="https://console.cloud.google.com/billing"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
							>
								Set up billing
								<ExternalLink size={16} className="ml-1" />
							</a>
						</div>
					</div>

					<div className="bg-white rounded-lg p-6 shadow-sm border">
						<div className="flex items-center mb-4">
							<div className="bg-gray-100 rounded p-2 mr-3">
								<span className="font-mono text-sm">.env</span>
							</div>
							<h2 className="text-xl font-semibold text-gray-900">
								Step 3: Configure Your API Key
							</h2>
						</div>
						<div className="space-y-3 text-gray-700">
							<p>
								Add your API key to your{" "}
								<code className="bg-gray-100 px-2 py-1 rounded">.env</code>{" "}
								file:
							</p>
							<div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
								VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
							</div>
							<p className="text-sm text-gray-600">
								Make sure to restart your development server after adding the
								API key.
							</p>
						</div>
					</div>

					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
						<h3 className="font-semibold text-yellow-800 mb-3">
							Common Issues:
						</h3>
						<ul className="space-y-2 text-yellow-700 text-sm">
							<li>
								• <strong>Authentication Error:</strong> Check if your API key
								is correct and billing is enabled
							</li>
							<li>
								• <strong>Quota Exceeded:</strong> You may have reached your API
								usage limits
							</li>
							<li>
								• <strong>Domain Restrictions:</strong> Make sure localhost is
								allowed in your API key restrictions
							</li>
							<li>
								• <strong>API Not Enabled:</strong> Verify that Maps JavaScript
								API is enabled in your project
							</li>
						</ul>
					</div>

					<ApiKeyTester />
				</div>
			</div>
		</div>
	);
}
