import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center p-6 md:p-10 bg-background">
      <Card className="w-full max-w-lg shadow-2xl bg-card text-card-foreground border-border">
        <CardHeader className="items-center text-center">
          <Lightbulb className="w-12 h-12 text-primary mb-3" />
          <CardTitle className="text-2xl font-semibold">Welcome to Popup Pro</CardTitle>
          <CardDescription className="text-muted-foreground">
            This application demonstrates a VSCode-like interface.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm">
            Click the <strong className="text-primary">message icon</strong> in the activity bar (on the left) to trigger a popup notification.
          </p>
          <p className="text-xs text-muted-foreground">
            The activity bar and popup are styled to resemble the Visual Studio Code environment.
          </p>
          <div data-ai-hint="computer code" className="mt-6 p-4 bg-muted/50 rounded-md border border-border text-left text-xs overflow-x-auto">
            <pre>
<code>
// Example: How to trigger the popup
// 1. Locate the MessageSquare icon in the activity bar.
// 2. Click the icon.
// 3. Observe the popup dialog.
</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
