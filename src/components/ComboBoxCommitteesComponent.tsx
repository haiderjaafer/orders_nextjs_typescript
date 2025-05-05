"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { Separator } from "@radix-ui/react-separator"



// Define the committee type
interface Committee {
  value: string;
  label: string;
}



interface ComboBoxComponentProps {
  valueType: string | undefined;
  onChange: (selectedValue: string) => void;
  fetchUrl?: string; // Optional prop to dynamically set fetch URL

}

// Use React.forwardRef to pass the ref
const ComboBoxComponentCommittees = React.forwardRef<
  HTMLButtonElement,
  ComboBoxComponentProps
>(({ valueType, onChange,fetchUrl }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input

  const [selectedCo, setSelectedCo] = useState<string | null>(null); // State for selected co value


  // Fetch committees from API
  useEffect(() => {


    const fetchCommittees = async () => {
        try {
          if (!fetchUrl) return;
          const response = await fetch(fetchUrl);
          const data = await response.json();
      
          // Correct the mapping based on actual API response shape
          const formattedCommittees = data.map((committee: { coID: string; Com: string }) => ({
            value: committee.coID,
            label: committee.Com,
          }));
      
          setCommittees(formattedCommittees);
          console.log(formattedCommittees);
        } catch (error) {
          console.error('Error fetching committees:', error);
        }
      };
      
    

    fetchCommittees();
  }, []);

   // Filter committees based on search query
   const filteredCommittees = committees.filter((committee) =>
    committee.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-end justify-end">

     
       
        
        


     
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild >
        <Button
          ref={ref} // Attach the ref here
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[370px] justify-between"
        >
       <div className="font-bold">
       {valueType
            ? committees.find((committee) => committee.value === valueType)?.label 
            : "أختر الهيأة"}
       </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 text-center ">
        <Command>
        
        <input

  placeholder="... البحث عـن هيأة "
  value={searchQuery}
  className="w-full p-1 text-right mr-2 text-lg font-normal text-black outline-none pr-5"
   onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)} // Intercept input changes

/>

          <CommandList  >
            <CommandEmpty className="font-bold text-center p-2 text-red-700 ">لا توجد هيأة </CommandEmpty>
            <CommandGroup className="bg-slate-100 text-center ">
            {filteredCommittees.map((committee) => (
  <div className="font-extrabold" key={committee.value}> {/* ✅ Key moved here */}
    <CommandItem
      className="text-black text-center"
      value={committee.value}
      onSelect={(currentValue) => {
        onChange(currentValue === valueType ? "" : currentValue);
        setSelectedCo(committee.value);
        setOpen(false);
      }}
    >
      <div className="m-auto hover:text-blue-500 transition-colors duration-100">
        {committee.label}
      </div>
      <Check
        className={cn(
          "m-0",
          valueType === committee.value ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  </div>
))}

            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    {/* <div>{fetchUrl}</div> */}

       {/* Display the selected co value */}
       {/* {selectedCo && (
        <div className="mt-2 text-sm text-gray-600">
          <strong>Selected Committee Co Value:</strong> {selectedCo}
        </div>
      )} */}
      </div>
   
  );
});

// Add displayName for easier debugging
ComboBoxComponentCommittees.displayName = "ComboBoxComponentCommittees";

export default ComboBoxComponentCommittees;
