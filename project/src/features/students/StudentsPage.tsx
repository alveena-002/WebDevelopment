import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { studentsApi } from "@/api/studentsApi";
import { coursesApi, batchesApi } from "@/api/coursesApi";
import type { StudentProfile, Profile, Course, Batch } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Row = StudentProfile & { profiles: Profile };

const columnHelper = createColumnHelper<Row>();

export default function StudentsPage() {
  const [data, setData] = useState<Row[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [students, courseList, batchList] = await Promise.all([
          studentsApi.list(),
          coursesApi.list(),
          batchesApi.list(),
        ]);
        setData(students);
        setCourses(courseList);
        setBatches(batchList);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const courseName = (id: string) => courses.find((c) => c.id === id)?.name ?? "—";
  const batchName = (id: string) => batches.find((b) => b.id === id)?.name ?? "—";

  const columns = [
    columnHelper.display({
      id: "avatar",
      header: "",
      cell: (info) => (
        <Avatar src={info.row.original.profiles?.avatar_url} name={info.row.original.profiles?.full_name ?? ""} size="sm" />
      ),
    }),
    columnHelper.accessor((row) => row.profiles?.full_name, { id: "name", header: "Name" }),
    columnHelper.accessor("application_id", { header: "Application ID" }),
    columnHelper.accessor((row) => row.profiles?.email, { id: "email", header: "Email" }),
    columnHelper.accessor((row) => courseName(row.course_id), { id: "course", header: "Course" }),
    columnHelper.accessor((row) => batchName(row.batch_id), { id: "batch", header: "Batch" }),
    columnHelper.accessor("enrollment_date", {
      header: "Enrolled",
      cell: (info) => formatDate(info.getValue()),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Students</h1>
          <p className="text-sm text-muted-foreground">Search, filter and view complete student records.</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <Users className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No students found</p>
              <p className="text-sm text-muted-foreground">
                Students appear here once they sign up and complete their profile.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40">
                    {table.getHeaderGroups().map((hg) => (
                      <tr key={hg.id}>
                        {hg.headers.map((h) => (
                          <th key={h.id} className="px-4 py-3 text-left font-medium text-muted-foreground">
                            {flexRender(h.column.columnDef.header, h.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="cursor-pointer border-b last:border-0 hover:bg-accent/50"
                        onClick={() => setSelected(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t p-3">
                <p className="text-sm text-muted-foreground">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar src={selected.profiles?.avatar_url} name={selected.profiles?.full_name ?? ""} size="xl" />
                <div>
                  <p className="text-lg font-semibold">{selected.profiles?.full_name}</p>
                  <p className="text-sm text-muted-foreground">{selected.profiles?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p><span className="text-muted-foreground">Father Name: </span>{selected.father_name}</p>
                <p><span className="text-muted-foreground">Phone: </span>{selected.profiles?.phone ?? "—"}</p>
                <p><span className="text-muted-foreground">Application ID: </span>{selected.application_id}</p>
                <p><span className="text-muted-foreground">Enrollment Date: </span>{formatDate(selected.enrollment_date)}</p>
                <p><span className="text-muted-foreground">Course: </span>{courseName(selected.course_id)}</p>
                <p><span className="text-muted-foreground">Batch: </span>{batchName(selected.batch_id)}</p>
                <p className="col-span-2"><span className="text-muted-foreground">Address: </span>{selected.address ?? "—"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
