import { redirect } from "react-router";

export function loader() {
	// Redirect to world data by default
	throw redirect("/corona/OWID_WRL");
}

// This component won't be rendered due to the redirect
export default function CoronaRedirectPage() {
	return null;
}
