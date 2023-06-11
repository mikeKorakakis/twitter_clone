"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { gqlClient } from "@/lib/client"
import { SearchUsersDocument, SearchUsersQuery, SearchUsersQueryVariables } from "@/gql/graphql"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]



export function UserSearch() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

//   const client = gqlClient()
//   const res = await client.request<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, { searchTerm: value })
//   const users = res.searchUsers
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Search className="shrink-0 opacity-50 hover:cursor-pointer hover:opacity-100" />
        {/* <Button

          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button> */}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((user) => (
              <CommandItem
                key={user.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === user.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {user.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
