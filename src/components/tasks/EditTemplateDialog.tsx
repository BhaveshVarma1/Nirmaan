import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  TaskTemplate,
  TaskCategory,
  TaskPriority,
  RecurrencePattern,
} from '@/types/task';
import useTaskStore from '@/lib/store/taskStore';
import {
  Plus,
  X,
  Tags,
  FileTemplate,
  Repeat,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

interface EditTemplateDialogProps {
  template?: TaskTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({
  template,
  open,
  onOpenChange,
}) => {
  const [name, setName] = React.useState(template?.name || '');
  const [description, setDescription] = React.useState(template?.description || '');
  const [category, setCategory] = React.useState<TaskCategory>(
    template?.category || TaskCategory.Work
  );
  const [priority, setPriority] = React.useState<TaskPriority>(
    template?.priority || TaskPriority.Medium
  );
  const [duration, setDuration] = React.useState({
    hours: template?.duration?.hours || 0,
    minutes: template?.duration?.minutes || 0,
  });
  const [tags, setTags] = React.useState<string[]>(template?.tags || []);
  const [newTag, setNewTag] = React.useState('');
  const [recurrence, setRecurrence] = React.useState(template?.recurrence);
  const [showRecurrenceSettings, setShowRecurrenceSettings] = React.useState(false);

  const addTemplate = useTaskStore((state) => state.addTemplate);
  const updateTemplate = useTaskStore((state) => state.updateTemplate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const templateData: TaskTemplate = {
      id: template?.id || crypto.randomUUID(),
      name,
      description,
      category,
      priority,
      duration,
      tags,
      recurrence,
      createdAt: template?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (template) {
      updateTemplate(templateData);
    } else {
      addTemplate(templateData);
    }

    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {template ? 'Edit' : 'Create'} Template
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter template name"
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter template description"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(value: TaskCategory) => setCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskCategory).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(value: TaskPriority) => setPriority(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskPriority).map((pri) => (
                    <SelectItem key={pri} value={pri}>
                      {pri}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label>Estimated Duration</Label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  value={duration.hours}
                  onChange={(e) =>
                    setDuration({ ...duration, hours: parseInt(e.target.value) || 0 })
                  }
                  placeholder="Hours"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={duration.minutes}
                  onChange={(e) =>
                    setDuration({ ...duration, minutes: parseInt(e.target.value) || 0 })
                  }
                  placeholder="Minutes"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="flex-1"
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Recurrence */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Recurrence
            </Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRecurrenceSettings(!showRecurrenceSettings)}
              className="w-full justify-between"
            >
              {recurrence ? `Repeats ${recurrence.pattern.toLowerCase()}` : 'Set recurrence'}
              <Plus className="h-4 w-4" />
            </Button>
            {showRecurrenceSettings && (
              <div className="space-y-4 p-4 rounded-md border">
                <Select
                  value={recurrence?.pattern}
                  onValueChange={(value: RecurrencePattern) =>
                    setRecurrence({
                      pattern: value,
                      interval: 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RecurrencePattern).map((pattern) => (
                      <SelectItem key={pattern} value={pattern}>
                        {pattern}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {recurrence && (
                  <>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label>Interval</Label>
                        <Input
                          type="number"
                          min="1"
                          value={recurrence.interval}
                          onChange={(e) =>
                            setRecurrence({
                              ...recurrence,
                              interval: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                      {recurrence.pattern === RecurrencePattern.Custom && (
                        <div className="flex-1">
                          <Label>End After</Label>
                          <Input
                            type="number"
                            min="1"
                            value={recurrence.occurrences}
                            onChange={(e) =>
                              setRecurrence({
                                ...recurrence,
                                occurrences: parseInt(e.target.value),
                              })
                            }
                            placeholder="Occurrences"
                          />
                        </div>
                      )}
                    </div>

                    {(recurrence.pattern === RecurrencePattern.Weekly ||
                      recurrence.pattern === RecurrencePattern.Custom) && (
                      <div>
                        <Label>Days of Week</Label>
                        <div className="flex gap-2 mt-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                            (day, index) => (
                              <Button
                                key={day}
                                type="button"
                                variant={
                                  recurrence.daysOfWeek?.includes(index)
                                    ? 'default'
                                    : 'outline'
                                }
                                className="w-10 h-10 p-0"
                                onClick={() => {
                                  const days = recurrence.daysOfWeek || [];
                                  setRecurrence({
                                    ...recurrence,
                                    daysOfWeek: days.includes(index)
                                      ? days.filter((d) => d !== index)
                                      : [...days, index],
                                  });
                                }}
                              >
                                {day[0]}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {template ? 'Update' : 'Create'} Template
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateDialog; 