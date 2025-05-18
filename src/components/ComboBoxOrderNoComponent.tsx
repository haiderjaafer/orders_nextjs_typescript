// function SearchOrderNoPage() {
//   return (
//     <div className="flex justify-center items-center">SearchOrderNoPage</div>
//   )
// }
// export default SearchOrderNoPage




'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface ComboBoxOrderNoProps {
  value: string | undefined
  onChange: (value: string) => void
  fetchUrl: string
}

export default function ComboBoxOrderNoComponent({
  value,
  onChange,
  fetchUrl,
}: ComboBoxOrderNoProps) {
  const [open, setOpen] = useState(false)
  const [orderNos, setOrderNos] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchOrderNos = async () => {
      setIsLoading(true)
      try {
        //const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/getAll`)
        const res = await fetch(fetchUrl)
        const data: string[] = await res.json()
        console.log("data",data)
        setOrderNos(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch orderNos:', err)
        setOrderNos([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderNos()
  }, [fetchUrl])

  const filtered = useMemo(() => {
    return orderNos.filter((o) =>
      o.toLowerCase().includes(query.toLowerCase())
    )
  }, [orderNos, query])

  const handleSelect = (selected: string) => {
    onChange(selected === value ? '' : selected)
    setOpen(false)
    console.log("selected",selected)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between font-bold"
        >
          {value || 'اختر رقم الطلب'}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="البحث عن رقم الطلب..."
            value={query}
            onValueChange={setQuery}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>لا يوجد نتائج.</CommandEmpty>
            <CommandGroup>
              {filtered.map((orderNo) => (
                <CommandItem
                  key={orderNo}
                  value={orderNo}
                  onSelect={() => handleSelect(orderNo)}
                  className="justify-between"
                >
                  {orderNo}
                  <Check
                    className={cn(
                      'ml-2 h-4 w-4',
                      value === orderNo ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

