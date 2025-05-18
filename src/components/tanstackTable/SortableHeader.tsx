// components/SortableHeader.tsx
import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortableHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  sortable?: boolean; // 👈 if false, hide sorting
}

export function SortableHeader<TData, TValue>({
  column,
  title,
  sortable = false,
  className,
}: SortableHeaderProps<TData, TValue>) {
  // ❌ Hide sort UI if sortable is false
  if (!sortable || !column.getCanSort()) {
    return <div className={cn("text-center font-extrabold text-[24px] h-20 ", className)}>{title}</div>;
  }

  // ✅ Show sort UI
  return (
    <div className={cn("flex items-center justify-center ", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-full px-2 data-[state=open]:bg-primary/10",
              column.getIsSorted() && "bg-primary/10"
            )}
          >
            <span className="font-extrabold text-[24px] ">{title}</span>
            {column.getIsSorted() === "desc" && <ArrowDown className="ml-1 h-4 w-4" />}
            {column.getIsSorted() === "asc" && <ArrowUp className="ml-1 h-4 w-4" />}
            {!column.getIsSorted() && <ChevronsUpDown className="ml-1 h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 h-4 w-4" />
            Ascending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 h-4 w-4" />
            Descending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.clearSorting()}>
            <X className="mr-2 h-4 w-4" />
            Clear Sort
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
