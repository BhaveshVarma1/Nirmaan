import React, { useState, useEffect } from "react";
import { Plus, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import IdeaCard from "./IdeaCard";
import RichTextEditor from "./RichTextEditor";
import { supabase, IdeaDB } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Idea {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
}

interface IdeaJournalProps {
  ideas?: Idea[];
}

const IdeaJournal: React.FC<IdeaJournalProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isNewIdeaDialogOpen, setIsNewIdeaDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [newIdea, setNewIdea] = useState({
    title: "",
    description: "",
    content: "",
  });

  // Load ideas from Supabase on component mount
  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedIdeas: Idea[] = (data as IdeaDB[]).map(idea => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        content: idea.content,
        date: new Date(idea.created_at).toLocaleDateString(),
      }));

      setIdeas(formattedIdeas);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast({
        title: "Error",
        description: "Failed to load ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewIdea = async () => {
    if (!newIdea.title.trim() || !newIdea.content.trim()) return;

    try {
      setIsLoading(true);
      const ideaToCreate = {
        title: newIdea.title,
        description: newIdea.content.replace(/<[^>]*>/g, '').slice(0, 150) + "...",
        content: newIdea.content,
      };

      const { data, error } = await supabase
        .from('ideas')
        .insert([ideaToCreate])
        .select()
        .single();

      if (error) throw error;

      const createdIdea: Idea = {
        id: data.id,
        title: data.title,
        description: data.description,
        content: data.content,
        date: new Date(data.created_at).toLocaleDateString(),
      };

      setIdeas(prev => [createdIdea, ...prev]);
      setNewIdea({ title: "", description: "", content: "" });
      setIsNewIdeaDialogOpen(false);
      toast({
        title: "Success",
        description: "Idea created successfully!",
      });
    } catch (error) {
      console.error('Error creating idea:', error);
      toast({
        title: "Error",
        description: "Failed to create idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditIdea = async () => {
    if (!currentIdea || !currentIdea.title.trim() || !currentIdea.content.trim()) return;

    try {
      setIsLoading(true);
      const ideaToUpdate = {
        title: currentIdea.title,
        description: currentIdea.content.replace(/<[^>]*>/g, '').slice(0, 150) + "...",
        content: currentIdea.content,
      };

      const { error } = await supabase
        .from('ideas')
        .update(ideaToUpdate)
        .eq('id', currentIdea.id);

      if (error) throw error;

      const updatedIdea = {
        ...currentIdea,
        description: ideaToUpdate.description,
      };

      setIdeas(prev =>
        prev.map(idea =>
          idea.id === currentIdea.id ? updatedIdea : idea
        )
      );
      setIsEditDialogOpen(false);
      setCurrentIdea(null);
      toast({
        title: "Success",
        description: "Idea updated successfully!",
      });
    } catch (error) {
      console.error('Error updating idea:', error);
      toast({
        title: "Error",
        description: "Failed to update idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIdea = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setIdeas(prev => prev.filter(idea => idea.id !== id));
      toast({
        title: "Success",
        description: "Idea deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast({
        title: "Error",
        description: "Failed to delete idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewIdea = (idea: Idea) => {
    setCurrentIdea(idea);
    setIsViewDialogOpen(true);
  };

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.content.toLowerCase().includes(searchTerm.toLowerCase()),
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
              onClick={() => setIsNewIdeaDialogOpen(true)}
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
            className="transform transition-all duration-500 hover:scale-[1.02] cursor-pointer"
            style={{
              opacity: 0,
              animation: `fadeIn 0.5s ease-out forwards ${index * 0.1}s`,
            }}
            onMouseEnter={() => setHoveredCard(idea.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleViewIdea(idea)}
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
                onEdit={(e) => {
                  e.stopPropagation();
                  setCurrentIdea(idea);
                  setIsEditDialogOpen(true);
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  handleDeleteIdea(idea.id);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* New Idea Dialog */}
      <Dialog open={isNewIdeaDialogOpen} onOpenChange={setIsNewIdeaDialogOpen}>
        <DialogContent className="bg-slate-900 text-white border-slate-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Idea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newIdea.title}
                onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="Give your idea a name..."
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor
                content={newIdea.content}
                onChange={(content) => setNewIdea({ ...newIdea, content })}
                placeholder="Start writing your idea..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewIdeaDialogOpen(false)}
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNewIdea}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Idea Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-900 text-white border-slate-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Idea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={currentIdea?.title || ""}
                onChange={(e) =>
                  setCurrentIdea(
                    currentIdea ? { ...currentIdea, title: e.target.value } : null
                  )
                }
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor
                content={currentIdea?.content || ""}
                onChange={(content) =>
                  setCurrentIdea(
                    currentIdea ? { ...currentIdea, content } : null
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditIdea}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Idea Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-slate-900 text-white border-slate-700 max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold">
                {currentIdea?.title}
              </DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setIsEditDialogOpen(true);
                  }}
                  className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                >
                  Close
                </Button>
              </div>
            </div>
            <p className="text-slate-400 text-sm">Created on {currentIdea?.date}</p>
          </DialogHeader>
          <ScrollArea className="mt-4 max-h-[60vh] overflow-auto">
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: currentIdea?.content || "" }}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <style>{`
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
