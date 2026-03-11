import { Shield } from "lucide-react";
import FileUpload from "../components/FileUpload";

export default function Upload() {
  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        {/* Badge */}
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Shield className="h-4 w-4" />
            Encrypted Upload
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Upload Your File</h1>
          <p className="mt-3 text-muted-foreground">
            Your file will be encrypted before upload. Only the link holder can
            access it.
          </p>
        </div>

        <FileUpload />
      </div>
    </div>
  );
}
