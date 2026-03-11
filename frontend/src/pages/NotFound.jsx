import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-5">
            <Shield className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>

        <div>
          <p className="text-8xl font-black text-primary/20">404</p>
          <h1 className="text-2xl font-bold mt-2">Page Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The page you are looking for does not exist.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/")}
          aria-label="Return to home page"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
