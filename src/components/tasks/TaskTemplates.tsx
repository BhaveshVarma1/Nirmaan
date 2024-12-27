import React from 'react';
import { TaskTemplate } from '@/types/task';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  FileTemplate,
  Edit2,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import useTaskStore from '@/lib/store/taskStore';
import EditTemplateDialog from './EditTemplateDialog';

const TaskTemplates: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState<TaskTemplate | undefined>();
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const templates = useTaskStore((state) => state.templates);
  const deleteTemplate = useTaskStore((state) => state.deleteTemplate);

  const filteredTemplates = React.useMemo(() => {
    return templates.filter((template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [templates, searchTerm]);

  const handleViewTemplate = (template: TaskTemplate) => {
    setSelectedTemplate(template);
    setIsViewDialogOpen(true);
  };

  const handleEditTemplate = () => {
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTemplate = () => {
    if (selectedTemplate) {
      deleteTemplate(selectedTemplate.id);
      setSelectedTemplate(undefined);
      setIsViewDialogOpen(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Button
          onClick={() => {
            setSelectedTemplate(undefined);
            setIsEditDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Templates Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence initial={false}>
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group relative"
              >
                <div
                  className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50 transition-all duration-200 cursor-pointer"
                  onClick={() => handleViewTemplate(template)}
                >
                  {/* Template Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-medium text-white line-clamp-2">
                      {template.name}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template);
                            handleEditTemplate();
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template);
                            handleDeleteTemplate();
                          }}
                          className="text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Template Description */}
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                    {template.description}
                  </p>

                  {/* Template Metadata */}
                  <div className="space-y-3">
                    {/* Category & Priority */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-slate-700/30">
                        {template.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          template.priority === 'High'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : template.priority === 'Medium'
                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }
                      >
                        {template.priority}
                      </Badge>
                    </div>

                    {/* Tags */}
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-slate-700/30 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* View Template Dialog */}
      {selectedTemplate && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedTemplate.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-400">Description</h3>
                <p className="text-white whitespace-pre-wrap">
                  {selectedTemplate.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Category & Priority */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-400">
                      Category & Priority
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-slate-700/30">
                        {selectedTemplate.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          selectedTemplate.priority === 'High'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : selectedTemplate.priority === 'Medium'
                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }
                      >
                        {selectedTemplate.priority}
                      </Badge>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedTemplate.tags && selectedTemplate.tags.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-slate-400">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplate.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-slate-700/30 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Duration */}
                  {selectedTemplate.duration && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-slate-400">
                        Estimated Duration
                      </h3>
                      <p className="text-sm">
                        {selectedTemplate.duration.hours > 0 &&
                          `${selectedTemplate.duration.hours} hours `}
                        {selectedTemplate.duration.minutes > 0 &&
                          `${selectedTemplate.duration.minutes} minutes`}
                      </p>
                    </div>
                  )}

                  {/* Recurrence */}
                  {selectedTemplate.recurrence && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-slate-400">
                        Recurrence
                      </h3>
                      <p className="text-sm">
                        Repeats {selectedTemplate.recurrence.pattern.toLowerCase()}
                        {selectedTemplate.recurrence.interval > 1 &&
                          ` every ${selectedTemplate.recurrence.interval} ${selectedTemplate.recurrence.pattern.toLowerCase()}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleEditTemplate}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteTemplate}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Template Dialog */}
      <EditTemplateDialog
        template={selectedTemplate}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedTemplate(undefined);
          }
        }}
      />
    </div>
  );
};

export default TaskTemplates; 