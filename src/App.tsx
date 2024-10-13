import { TooltipProvider } from "@radix-ui/react-tooltip";
import TemplateSegmentsPage from "./components/pages/template-segments-page";
import { ExampleForm } from "./components/pages/ExampleForm";

function App() {
	return (
		<>
			<TooltipProvider>
				{/* <TemplateSegmentsPage /> */}
				<ExampleForm />
			</TooltipProvider>
		</>
	);
}

export default App;
