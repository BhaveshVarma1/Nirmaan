import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar, MoreVertical, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IdeaCardProps {
  title?: string;
  description?: string;
  date?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  title = "Business Idea",
  description = "A revolutionary new approach to solving everyday problems.",
  date = new Date().toLocaleDateString(),
  onEdit = () => {},
  onDelete = () => {},
}) => {
  return (
    <Card
      className="relative group backdrop-blur-xl bg-slate-800/50 p-6 text-white border-slate-700/30 
      hover:bg-slate-700/50 transition-all duration-300 overflow-hidden rounded-xl"
    >
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 
        group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Sparkle Effects */}
      <div
        className="absolute -top-6 -right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 
        transform group-hover:translate-y-2 group-hover:translate-x-2"
      >
        <Sparkles className="h-12 w-12 text-blue-400/20" />
      </div>

      <div className="relative space-y-4">
        <div className="flex justify-between items-start">
          <h3
            className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r 
            from-white to-slate-300 group-hover:from-blue-400 group-hover:to-purple-400 
            transition-all duration-300"
          >
            {title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hover:bg-slate-600/50 p-1.5 rounded-full transition-colors duration-300 
                backdrop-blur-xl group-hover:bg-slate-700/50"
              >
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800/90 backdrop-blur-xl border-slate-700">
              <DropdownMenuItem
                onClick={onEdit}
                className="text-slate-300 hover:text-white 
                hover:bg-slate-700/50 cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-400 hover:text-red-300 
                hover:bg-red-500/10 cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p
          className="text-slate-300 text-sm line-clamp-3 group-hover:text-slate-200 
          transition-colors duration-300"
        >
          {description}
        </p>

        <div
          className="flex items-center text-slate-400 text-sm bg-slate-800/50 w-fit px-3 py-1.5 
          rounded-full backdrop-blur-xl border border-slate-700/30 group-hover:border-slate-600/30 
          transition-all duration-300"
        >
          <Calendar className="h-3.5 w-3.5 mr-2" />
          {date}
        </div>
      </div>
    </Card>
  );
};

export default IdeaCard;
