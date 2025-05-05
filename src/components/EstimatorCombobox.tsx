"use client";

import { useEffect, useState } from "react";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Estimator = {
  estimatorID: number;
  estimatorName: string;
};

export default function EstimatorCombobox({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [estimators, setEstimators] = useState<Estimator[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>("اختر اسم المخمن");

  useEffect(() => {
    const fetchEstimators = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/estimators");
        const data = await res.json();
        setEstimators(data);
      } catch (err) {
        console.error("خطأ في جلب أسماء المخمنين:", err);
      }
    };

    fetchEstimators();
  }, []);

  useEffect(() => {
    if (value !== null) {
      const found = estimators.find(e => e.estimatorID === value);
      if (found) setSelectedLabel(found.estimatorName);
    }
  }, [value, estimators]);

  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 font-bold text-gray-700">اسم المخمن</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="justify-between w-full text-right text-base font-bold p-3 border-2 border-gray-300 rounded-md shadow-sm py-5"
          >
            {selectedLabel}
            <span className="ml-2 ">▼</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0 rtl">
          <Command>
            <CommandInput placeholder="ابحث عن اسم المخمن..."  className="text-right font-medium" />
            <CommandList>
              <CommandEmpty>لا يوجد نتائج</CommandEmpty>
              <CommandGroup>
                {estimators.map((estimator) => (
                  <CommandItem
                    key={estimator.estimatorID}
                    value={estimator.estimatorName}
                    onSelect={() => {
                      onChange(estimator.estimatorID);
                      setSelectedLabel(estimator.estimatorName);
                      setOpen(false);
                    }}
                    className="text-right px-4 py-3 text-lg hover:bg-blue-100 font-bold cursor-pointer transition-colors duration-150"

                  >
                    {estimator.estimatorName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
