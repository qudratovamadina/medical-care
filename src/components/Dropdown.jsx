import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { ChevronDown } from "lucide-react";

export function Dropdown({ specialties = [], onSelect }) {
  return (
    <Menu>
      <MenuHandler>
        <Button className="flex items-center gap-2 border bg-transparent px-2 py-2 pl-4 text-gray-900 shadow-none">
          Filter by Specialty
          <ChevronDown size={16} />
        </Button>
      </MenuHandler>
      <MenuList>
        {specialties.length > 0 ? (
          specialties.map((specialty, index) => (
            <MenuItem key={index} onClick={() => onSelect(specialty)}>
              {specialty}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No specialties available</MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
