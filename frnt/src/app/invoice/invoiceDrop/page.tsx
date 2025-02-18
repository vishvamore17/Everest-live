"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { MdCancel } from "react-icons/md";
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

interface Invoice {
  _id: string;
  companyName: string;
    customerName: string;
    contactNumber: string;
    emailAddress: string;
    address: string;
    gstNumber: string;
    productName: string;
    amount:number;  
    discount: number;
    gstRate: number;
    status: "Pending" | "Unpaid" | "Paid";
    date: string;
    totalWithoutGst: number;
    totalWithGst: number;
    paidAmount: 0 | number;
    remainingAmount: number;
  isActive: boolean;
}


export default function App() {
  const [error, setError] = useState("");
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [groupedInvoices, setGroupedInvoices] = useState<Record<string, Invoice[]>>({});
  

  const statusColors: Record<string, string> = {
    Pending: "bg-orange-100 text-orange-800",
    Unpaid: "bg-blue-100 text-blue-800",
    Paid: "bg-yellow-100 text-yellow-800",
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

 
  return (
    <SidebarProvider>
      <AppSidebar/>
      <div className="row">
        <SidebarInset>
                <header className="row h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="row items-center gap-2 px-4 w-full">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                    </BreadcrumbLink>
                                    <BreadcrumbLink href="/invoice/invoiceDrop">
                                   
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block"/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Drag & Drop</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                </SidebarInset>
    <div className="p-6">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Object.keys(statusColors).map((status) => {
          const invoiceStatus = groupedInvoices[status] || [];
          const totalAmount = invoiceStatus.reduce((sum,invoice)=> sum+invoice.amount, 0)
          return (
            <div
              key={status}
              className={`p-4 rounded-lg shadow-md min-h-[300px] transition-all ${draggedOver === status }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDraggedOver(status);
              }}
              onDragLeave={() => setDraggedOver(null)}
            >
              <h2 className={`text-sm font-bold mb-4 px-5 py-2 rounded-lg ${statusColors[status]}`}>{status}</h2>
              <div className="p-3 bg-white rounded-md shadow">
                <p className="text-sm font-semibold text-black">Total Invoice: {invoiceStatus.length}</p>
                <p className="text-sm font-semibold text-black">Total Amount: ₹{totalAmount}</p>
              </div>
              {invoiceStatus.length === 0 ? (
                  <p className="text-gray-500 text-center">No leads available</p>
                ) : (
                  invoiceStatus.map((invoice) => (
                    <div
                      key={invoice._id}
                      className="border border-gray-300 rounded-lg shadow-md bg-white p-3"
                      draggable
                >
                      <p className="text-sm font-semibold text-black">Company Name: </p>
                      <p className="text-sm font-semibold text-black">Product: </p>
                      <p className="text-sm font-semibold text-black">Next Date: </p>
                      <p className="text-sm font-semibold text-black">Amount: </p>
                    </div>
                  ))
                )}
            </div>
          );
        })}
      </div>

     
    </div>
    </div>
    </SidebarProvider>
  );
}
