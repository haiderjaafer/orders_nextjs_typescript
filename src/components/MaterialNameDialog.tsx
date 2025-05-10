"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OrderFormData } from "@/types";

export function MaterialNameDialog({ open, setOpen, formData, setFormData }:any) {
  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>تعديل اسم المادة</DialogTitle>
          <DialogDescription>قم بإدخال تفاصيل المادة.</DialogDescription>
        </DialogHeader>
        <Textarea
          value={formData.materialName}
    onChange={(e) =>
  setFormData((prev: OrderFormData) => ({
    ...prev,
    materialName: e.target.value,
  }))
}



          
          rows={6}
          className="mt-2"
          placeholder="اكتب اسم المادة هنا..."
        />
        <DialogFooter>
          <Button onClick={handleSave}>تم</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
