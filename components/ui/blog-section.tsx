import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Blog = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto flex flex-col gap-14">
      <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
        <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
          Latest insights
        </h4>
        <Button className="gap-4">
          View all articles <MoveRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col gap-2 hover:opacity-75 cursor-pointer">
          <div className="bg-muted rounded-md aspect-video mb-4 flex items-center justify-center">
            <span className="text-6xl">🤖</span>
          </div>
          <h3 className="text-xl tracking-tight">Building LLM-Powered Applications</h3>
          <p className="text-muted-foreground text-base">
            Learn how to integrate large language models into your software architecture for scalable, intelligent solutions.
          </p>
        </div>
        <div className="flex flex-col gap-2 hover:opacity-75 cursor-pointer">
          <div className="bg-muted rounded-md aspect-video mb-4 flex items-center justify-center">
            <span className="text-6xl">⚡</span>
          </div>
          <h3 className="text-xl tracking-tight">Optimizing AI Performance</h3>
          <p className="text-muted-foreground text-base">
            Best practices for fine-tuning and optimizing AI models to deliver consistent, high-quality results in production.
          </p>
        </div>
        <div className="flex flex-col gap-2 hover:opacity-75 cursor-pointer">
          <div className="bg-muted rounded-md aspect-video mb-4 flex items-center justify-center">
            <span className="text-6xl">🔧</span>
          </div>
          <h3 className="text-xl tracking-tight">Modern Development Practices</h3>
          <p className="text-muted-foreground text-base">
            Adopting the latest tools and methodologies to build maintainable, testable software in the AI era.
          </p>
        </div>
        <div className="flex flex-col gap-2 hover:opacity-75 cursor-pointer">
          <div className="bg-muted rounded-md aspect-video mb-4 flex items-center justify-center">
            <span className="text-6xl">📊</span>
          </div>
          <h3 className="text-xl tracking-tight">Data-Driven Decision Making</h3>
          <p className="text-muted-foreground text-base">
            How to leverage analytics and insights to make informed decisions about your software development process.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export { Blog };
