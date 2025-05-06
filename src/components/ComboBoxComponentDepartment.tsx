'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';

interface Department {
  value: string;
  label: string;
}

interface ComboBoxComponentProps {
  valueType: string | undefined;
  onChange: (selectedValue: string) => void;
  fetchUrl?: string; // Endpoint: /api/departments/by-committee/{id}
}

const ComboBoxComponentDepartment = React.forwardRef<
  HTMLButtonElement,
  ComboBoxComponentProps
>(({ valueType, onChange, fetchUrl }, ref) => {
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch departments when fetchUrl changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!fetchUrl) return;
  
      try {
        const response = await fetch(fetchUrl);
        const data = await response.json();
  
        // ✅ Check if response is an array or wrapped in an object
        const departmentsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.departments)
          ? data.departments
          : [];
  
        const formattedDepartments = departmentsArray.map((dept: { deID: number; Dep: string }) => ({
          value: dept.deID.toString(),
          label: dept.Dep,
        }));
  
        setDepartments(formattedDepartments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
  
    fetchDepartments();
  }, [fetchUrl]);
  
  // Filtered list memoized
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) =>
      dept.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [departments, searchQuery]);

  // onSelect handler memoized
  const handleSelect = useCallback(
    (selected: Department) => {
      const newValue = selected.value === valueType ? '' : selected.value;
      onChange(newValue);
      setOpen(false);
    },
    [onChange, valueType]
  );

  return (
    <div className="flex flex-col items-end justify-end">
      {/* <label className="font-extrabold text-lg mb-1">القسم</label> */}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[370px] justify-between font-bold h-10"
          >
            <div className="font-bold">
              {valueType
                ? departments.find((d) => d.value === valueType)?.label
                : 'اختر القسم'}
            </div>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0">
          <Command>
            <input
              placeholder="... البحث عـن القسم"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-1 text-right mr-2 text-lg font-normal text-black outline-none pr-5"
            />
            <CommandList>
              <CommandEmpty className="font-bold text-center p-2 text-red-700">
                لا يوجد قسم
              </CommandEmpty>
              <CommandGroup>
                {filteredDepartments.map((dept) => (
                  <CommandItem
                    key={dept.value}
                    value={dept.value}
                    onSelect={() => handleSelect(dept)}
                    className="text-black font-bold text-center"
                  >
                    <div className="m-auto hover:text-blue-500 transition-colors duration-100">
                      {dept.label}
                    </div>
                    <Check
                      className={cn(
                        'm-0',
                        valueType === dept.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
});

ComboBoxComponentDepartment.displayName = 'ComboBoxComponentDepartment';

export default ComboBoxComponentDepartment;
