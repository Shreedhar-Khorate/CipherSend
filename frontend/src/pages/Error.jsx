import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";

const errorMessages = {
  expired: {
    title: "File Expired",
    message:
      "This file has exceeded its expiration time and is no longer available.",
  },
  invalid: {
    title: "Invalid Link",
    message: "The link you followed is invalid or has been revoked.",
  },
  limit: {
    title: "Download Limit Reached",
    message: "This file has reached its maximum number of downloads.",
  },
  default: {
    title: "File Unavailable",
    message: "This file is no longer available.",
  },
};

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type") ?? "default";
  const { title, message } = errorMessages[type] ?? errorMessages.default;

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-5">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{message}</p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/")}
          aria-label="Return to home page"
        >
          Return Home
        </Button>
      </motion.div>
    </div>
  );
}
