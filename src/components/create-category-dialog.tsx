import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { categoriesApi } from "@/lib/api/categories";
import type { Category } from "@/lib/mock-data";

const CATEGORY_GRADIENTS = [
  { value: "from-indigo-600 to-fuchsia-600", label: "Indigo → Fuchsia" },
  { value: "from-emerald-500 to-teal-600", label: "Emerald → Teal" },
  { value: "from-rose-500 to-pink-600", label: "Rose → Pink" },
  { value: "from-slate-600 to-slate-900", label: "Slate" },
  { value: "from-amber-500 to-orange-600", label: "Amber → Orange" },
  { value: "from-cyan-500 to-blue-600", label: "Cyan → Blue" },
  { value: "from-fuchsia-600 to-purple-600", label: "Fuchsia → Purple" },
  { value: "from-violet-600 to-pink-600", label: "Violet → Pink" },
  { value: "from-blue-600 to-indigo-600", label: "Blue → Indigo" },
  { value: "from-sky-500 to-blue-600", label: "Sky → Blue" },
];

type CreateCategoryDialogProps = {
  onCategoryCreated: (category: Category) => void;
};

export function CreateCategoryDialog({ onCategoryCreated }: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(CATEGORY_GRADIENTS[0].value);
  const [icon, setIcon] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setSlug("");
    setName("");
    setDescription("");
    setColor(CATEGORY_GRADIENTS[0].value);
    setIcon("");
  };

  const handleSave = async () => {
    if (!slug || !name) return;
    setSaving(true);
    try {
      const res = await categoriesApi.create({ slug, name, description, color, icon });
      if (res.success) {
        onCategoryCreated(res.data);
        reset();
        setOpen(false);
      } else {
        toast.error(res.message || "Failed to create category");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create category";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New category</DialogTitle>
          <DialogDescription>Create a new category for posts.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 overflow-y-auto px-1" style={{ maxHeight: "60vh" }}>
          <div>
            <label htmlFor="cat-slug" className="mb-1 block text-sm font-medium">
              Slug
            </label>
            <Input
              id="cat-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-category"
            />
          </div>
          <div>
            <label htmlFor="cat-name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Category"
            />
          </div>
          <div>
            <label htmlFor="cat-description" className="mb-1 block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="cat-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category description"
              rows={2}
            />
          </div>
          <div>
            <label htmlFor="cat-color" className="mb-1 block text-sm font-medium">
              Color
            </label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger id="cat-color">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_GRADIENTS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="cat-icon" className="mb-1 block text-sm font-medium">
              Icon
            </label>
            <Input
              id="cat-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="🚀"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!slug || !name || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
