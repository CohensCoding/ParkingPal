import { Route, Switch } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import HistoryPage from "@/pages/history";
import ProfilePage from "@/pages/profile";
import BottomNavigation from "@/components/BottomNavigation";

function App() {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen relative">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/history" component={HistoryPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route component={NotFound} />
        </Switch>
        <BottomNavigation />
      </div>
    </TooltipProvider>
  );
}

export default App;
