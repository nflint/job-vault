'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  TableMeta,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/**
 * Data Table Component Module
 * 
 * A flexible and reusable data table component that supports:
 * - Dynamic column definitions
 * - Sorting
 * - Pagination
 * - Row selection
 * - Custom cell rendering
 * - Data updates through meta object
 */

/**
 * Props for the DataTable component
 * @interface
 */
interface DataTableProps<TData, TValue> {
  /** Array of column definitions specifying how to display and interact with data */
  columns: ColumnDef<TData, TValue>[]
  /** Array of data items to display in the table */
  data: TData[]
  /** Optional meta object for table operations like updates and deletions */
  meta?: TableMeta<TData>
}

/**
 * Meta interface for table operations
 * @interface
 */
interface TableMeta<TData> {
  /** Callback function to update a data item */
  updateData?: (updatedData: TData) => void
}

/**
 * DataTable component for displaying and managing tabular data
 * 
 * @template TData - The type of data being displayed
 * @template TValue - The type of values in the table cells
 * @param {DataTableProps<TData, TValue>} props - Component props
 * @returns {JSX.Element} Rendered data table
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
}: DataTableProps<TData, TValue>): JSX.Element {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
  })

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b bg-transparent px-4 py-3 text-left align-middle font-medium text-muted-foreground"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="h-24 text-center align-middle text-sm"
              >
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

