import React, { useState } from "react";
import { Plus, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import IdeaCard from "./IdeaCard";

interface Idea {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface IdeaJournalProps {
  ideas?: Idea[];
}

const defaultIdeas: Idea[] = [
  {
    id: "1",
    title: "Home Decor E-commerce",
    description:
      "An online platform for unique home decoration items with AR preview functionality.",
    date: "2024-02-20",
  },
  {
    id: "2",
    title: "Sustainable Living Blog",
    description:
      "A blog focusing on eco-friendly home decoration tips and sustainable living practices.",
    date: "2024-02-21",
  },
];

const IdeaJournal: React.FC<IdeaJournalProps> = ({ ideas = defaultIdeas }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#1A1D21] to-[#12141a] space-y-8 p-8">
      {/* Header Section with Glassmorphism */}
      <div className="relative backdrop-blur-xl bg-slate-900/50 rounded-2xl p-8 border border-slate-700/30 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl" />
        <div className="relative space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-blue-400" />
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Idea Journal
            </h2>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Capture and organize your innovative ideas. Transform your thoughts
            into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-96 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-slate-800/50 border-slate-700/50 text-white rounded-xl backdrop-blur-xl
                    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>
            </div>
            <Button
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-500 hover:to-purple-500 text-white shadow-lg transition-all duration-300
                hover:shadow-blue-500/25 w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:scale-[2.5] transition-transform duration-500 rounded-full" />
              <div className="relative flex items-center justify-center gap-2">
                <Plus className="h-5 w-5" />
                <span>New Idea</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Ideas Grid with Advanced Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea, index) => (
          <div
            key={idea.id}
            className="transform transition-all duration-500 hover:scale-[1.02]"
            style={{
              opacity: 0,
              animation: `fadeIn 0.5s ease-out forwards ${index * 0.1}s`,
            }}
            onMouseEnter={() => setHoveredCard(idea.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl 
                  transition-opacity duration-300 ${hoveredCard === idea.id ? "opacity-100" : "opacity-0"}`}
              />
              <IdeaCard
                title={idea.title}
                description={idea.description}
                date={idea.date}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default IdeaJournal;
