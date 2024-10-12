import { TooltipProvider } from "@radix-ui/react-tooltip";
import TemplateSegmentsPage from "./components/pages/template-segments-page";

function App() {
	return (
		<>
			<TooltipProvider>
				<TemplateSegmentsPage />
			</TooltipProvider>
		</>
	);
}

export default App;
