import React, { useEffect, useState } from "react";

interface Committee {
  value: string;
  label: string;
}

interface ComboBoxComponentProps {
  valueType: string | undefined;
  onChange: (selectedValue: string) => void;
  fetchUrl?: string;
}

export const ComboBoxComponentCommittees = ({
  valueType,
  onChange,
  fetchUrl,
}: ComboBoxComponentProps) => {
  const [committees, setCommittees] = useState<Committee[]>([]);

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        if (!fetchUrl) return;
        const response = await fetch(fetchUrl);
        const data = await response.json();

        const formattedCommittees = data.map(
          (committee: { coID: string; Com: string }) => ({
            value: committee.coID,
            label: committee.Com,
          })
        );

        setCommittees(formattedCommittees);
      } catch (error) {
        console.error("Error fetching committees:", error);
      }
    };

    fetchCommittees();
  }, [fetchUrl]);

  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor="committee-select" className="text-lg font-extrabold text-gray-700">
        اختر الهيأة
      </label>
      <select
        id="committee-select"
        value={valueType ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right font-bold"
      >
        <option value="" disabled>
          -- اختر --
        </option>
        {committees.map((committee) => (
          <option key={committee.value} value={committee.value}>
            {committee.label}
          </option>
        ))}
      </select>
    </div>
  );
};












// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { ChevronsUpDown, Check } from "lucide-react";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// interface Committee {
//   value: string;
//   label: string;
// }

// interface ComboBoxComponentProps {
//   valueType: string | undefined;
//   onChange: (selectedValue: string) => void;
//   fetchUrl?: string; // Optional prop to dynamically set fetch URL
// }

// const ComboBoxComponentCommittees = React.forwardRef<
//   HTMLButtonElement,
//   ComboBoxComponentProps
// >(({ valueType, onChange, fetchUrl }, ref) => {
//   const [open, setOpen] = useState(false);
//   const [committees, setCommittees] = useState<Committee[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fetch data on mount or when fetchUrl changes
//   useEffect(() => {
//     const fetchCommittees = async () => {
//       try {
//         if (!fetchUrl) return;
//         const response = await fetch(fetchUrl);
//         const data = await response.json();

//         const formattedCommittees = data.map(
//           (committee: { coID: string; Com: string }) => ({
//             value: committee.coID,
//             label: committee.Com,
//           })
//         );

//         setCommittees(formattedCommittees);
//       } catch (error) {
//         console.error("Error fetching committees:", error);
//       }
//     };

//     fetchCommittees();
//   }, [fetchUrl]);

//   // Filter list only when necessary
//   const filteredCommittees = useMemo(() => {
//     return committees.filter((committee) =>
//       committee.label.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [committees, searchQuery]);

//   // Memoized selection handler
//   const handleSelect = useCallback(
//     (committee: Committee) => {
//       const newValue = committee.value === valueType ? "" : committee.value;
//       onChange(newValue);
//       setOpen(false);
//     },
//     [onChange, valueType]
//   );

//   return (
//     <div className="flex flex-col items-end justify-end">
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             ref={ref}
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             className="w-[370px] justify-between"
//           >
//             <div className="font-bold">
//               {valueType
//                 ? committees.find((c) => c.value === valueType)?.label
//                 : "أختر الهيأة"}
//             </div>
//             <ChevronsUpDown className="opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-[370px] p-0 text-center">
//           <Command>
//             <input
//               placeholder="... البحث عـن هيأة"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full p-1 text-right mr-2 text-lg font-normal text-black outline-none pr-5"
//             />
//             <CommandList>
//               <CommandEmpty className="font-bold text-center p-2 text-red-700">
//                 لا توجد هيأة
//               </CommandEmpty>
//               <CommandGroup className="bg-slate-100 text-center">
//                 {filteredCommittees.map((committee) => (
//                   <CommandItem
//                     key={committee.value}
//                     value={committee.value}
//                     onSelect={() => handleSelect(committee)}
//                     className="text-black text-center"
//                   >
//                     <div className="m-auto hover:text-blue-500 transition-colors duration-100 font-extrabold">
//                       {committee.label}
//                     </div>
//                     <Check
//                       className={cn(
//                         "m-0",
//                         valueType === committee.value
//                           ? "opacity-100"
//                           : "opacity-0"
//                       )}
//                     />
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// });

// ComboBoxComponentCommittees.displayName = "ComboBoxComponentCommittees";
// export default ComboBoxComponentCommittees;
