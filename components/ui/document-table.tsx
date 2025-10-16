"use client";

import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import TableDownloadIcon from "@/assets/icons/table-download-icon";
import TableTrashIcon from "@/assets/icons/table-trash-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatText } from "@/helpers";
import { useGetPropertyDocuments } from "@/hooks/api/use-properties";

export default function DocumentsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 100;

  const { id } = useParams();

  const propertyId = id ? Number(id) : undefined;
  const { data: documentsData } = useGetPropertyDocuments(propertyId as number);

  const filteredDocuments =
    documentsData?.data?.results?.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDownload = (docName: string) => {};

  const handleDelete = (docName: string) => {};

  return (
    <div className="w-full  mx-auto p-4 space-y-6  bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
        <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
        <div className="relative w-full sm:w-80 ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="border-none">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium text-gray-600 py-4">
                    DOCUMENT NAME
                  </TableHead>
                  <TableHead className="font-medium text-gray-600 py-4">
                    DOCUMENT TYPE
                  </TableHead>
                  <TableHead className="font-medium text-gray-600 py-4">
                    UPLOADED DATE
                  </TableHead>
                  <TableHead className="font-medium text-gray-600 py-4 text-right">
                    ACTION
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments?.map((doc) => (
                  <TableRow key={doc.id} className="border-b border-gray-100">
                    <TableCell className="py-4 font-medium text-gray-600 capitalize">
                      {doc.title}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600">
                      {formatText(doc.document_type)}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600">
                      {format(new Date(doc.created_at), "MMMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(doc.title)}
                          className="h-8 w-8 text-gray-400 hover:text-gray-600"
                        >
                          <TableDownloadIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(doc.title)}
                          className="h-8 w-8 text-gray-400 hover:text-red-600"
                        >
                          <TableTrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredDocuments?.map((doc) => (
          <Card key={doc.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-gray-900">
                {doc.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Document Type
                  </span>
                  <p className="text-sm text-gray-900">
                    {formatText(doc.document_type)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Uploaded Date
                  </span>
                  <p className="text-sm text-gray-900">
                    {format(new Date(doc.created_at), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(doc.title)}
                    className="h-8 w-8 text-gray-400 hover:text-gray-600"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc.title)}
                    className="h-8 w-8 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(1)}
            className={`h-8 px-3 ${currentPage === 1 ? "bg-gray-100" : ""}`}
          >
            1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(2)}
            className={`h-8 px-3 ${currentPage === 2 ? "bg-primary-200 text-primary-700" : ""}`}
          >
            2
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(3)}
            className={`h-8 px-3 ${currentPage === 3 ? "bg-gray-100" : ""}`}
          >
            3
          </Button>
          <span className="px-2 text-gray-500">...</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            className={`h-8 px-3 ${currentPage === totalPages ? "bg-gray-100" : ""}`}
          >
            {totalPages}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
