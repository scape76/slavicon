import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { GodInfo } from "@/types";
import React from "react";

type InfoTableProps = {
  information: GodInfo;
};

export function InfoTable({ information }: InfoTableProps) {
  return (
    <Table>
      <TableBody>
        {Object.entries(information).map(([groupName, record]) => {
          return (
            <React.Fragment key={groupName}>
              <TableRow>
                <TableCell colSpan={2} className="text-2xl font-semibold">
                  {toTitleCase(groupName)}
                  <hr className="border-b-2 mt-1 border-foreground w-1/3" />
                </TableCell>
              </TableRow>
              {Object.entries(record).map(([key, value], i) => (
                <TableRow key={key} className={i === 0 ? "pt-2" : ""}>
                  <TableCell className="font-semibold">
                    {toTitleCase(key)}
                  </TableCell>
                  <TableCell className="ml-auto">{value}</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function toTitleCase(text: string) {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}
