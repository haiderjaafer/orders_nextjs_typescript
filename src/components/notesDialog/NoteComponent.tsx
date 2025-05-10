import { useState } from "react";
import { NoteDialogComponent } from "./NoteDialogComponent";
import { OrderFormData } from "@/types";



interface NoteProps {
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
}

export default function NoteComponent({ formData, setFormData }:NoteProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-1">
      <label
        htmlFor="materialName"
        className="text-lg font-extrabold text-gray-700"
      >
        الملاحظات
      </label>
      <input
        type="text"
        id="materialName"
        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={formData.notes}
        onClick={() => setDialogOpen(true)} // open dialog on click
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            notes: e.target.value,
          }))
        }
        readOnly // prevent typing directly unless you want both behaviors
      />

      <NoteDialogComponent
        open={dialogOpen}
        setOpen={setDialogOpen}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
