import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

export type Rule = {
  id: string;
  num: string;
  direction: "Entrada" | "Salida";
  action: "Permitir" | "Denegar" | "Rechazar";
  from: string;
  to: string;
  port?: number;
  service?: string;
  protocol: string;
  active: boolean;
};


type Props = {
  data: Rule[];
  onDelete: (id: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onToggleActive: (id: string, active: boolean) => void;
};

export default function RulesTable({
  data,
  onDelete,
  onMove,
  onToggleActive,
}: Props) {
  const columns: ColumnDef<Rule>[] = [
    {
      accessorKey: "num",
      header: "#",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "action",
      header: "Acción",
    },
    {
      accessorKey: "direction",
      header: "Dirección",
    },
    {
      accessorKey: "from",
      header: "Origen",
    },
    {
      accessorKey: "to",
      header: "Destino",
    },
    {
      accessorKey: "port",
      header: "Puerto",
      cell: (info) => info.getValue() ?? "-", // Si no hay puerto
    },
    {
      accessorKey: "service",
      header: "Servicio",
      cell: (info) => info.getValue() ?? "-", // Si no hay servicio
    },
    {
      accessorKey: "protocol",
      header: "Protocolo",
    },
    {
      accessorKey: "active",
      header: "Estado",
      cell: ({ row }) => {
        const rule = row.original;
        return (
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rule.active}
              onChange={(e) => onToggleActive(rule.id, e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span
              className={`ml-2 font-semibold ${rule.active ? "text-green-600" : "text-red-600"
                }`}
            >
              {rule.active ? "Activa" : "Inactiva"}
            </span>
          </label>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const index = row.index;
        const isFirst = index === 0;
        const isLast = index === data.length - 1;

        return (
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={() => onMove(index, index - 1)}
                title="Mover arriba"
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowUp size={18} />
              </button>
            )}

            {!isLast && (
              <button
                onClick={() => onMove(index, index + 1)}
                title="Mover abajo"
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowDown size={18} />
              </button>
            )}

            <button
              onClick={() => onDelete(row.original.id)}
              title="Eliminar"
              className="p-2 text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      },
    },
  ];


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 border-b text-left"
                  colSpan={header.colSpan}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500"
              >
                No hay reglas para mostrar.
              </td>
            </tr>
          )}
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={row.index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3 border-b max-w-xl break-words whitespace-normal"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
