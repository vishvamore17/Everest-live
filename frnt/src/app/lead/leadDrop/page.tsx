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

interface Lead {
  _id: string;
  companyName: string;
  customerName: string;
  amount: number;
  productName: string;
  contactNumber: string;
  emailAddress: string;
  address: string;
  notes: string;
  date: string;
  endDate: string;
  status: "New" | "Discussion" | "Demo" | "Proposal" | "Decided";
  isActive: boolean;
}

const getAllLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/lead/getAllLeads");
    const data = await response.json();
    if (data.success) return data.data;
    throw new Error(data.message);
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw new Error("Failed to fetch leads");
  }
};

export default function App() {
  const [groupedLeads, setGroupedLeads] = useState<Record<string, Lead[]>>({});
  const [error, setError] = useState("");
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const fetchedLeads = await getAllLeads();
        groupLeadsByStatus(fetchedLeads);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchLeads();
  }, []);

  const groupLeadsByStatus = (leads: Lead[]) => {
    const grouped = leads.reduce((acc, lead) => {
      if (!acc[lead.status]) acc[lead.status] = [];
      acc[lead.status].push(lead);
      return acc;
    }, {} as Record<string, Lead[]>);
    setGroupedLeads(grouped);
  };

  const statusColors: Record<string, string> = {
    Proposal: "bg-blue-300 text-gray-800",
    New: "bg-blue-300 text-gray-800",
    Discussion: "bg-blue-300 text-gray-800",
    Demo: "bg-blue-300 text-gray-800",
    Decided: "bg-blue-300 text-gray-800",
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead, fromStatus: string) => {
    e.dataTransfer.setData("lead", JSON.stringify(lead));
    e.dataTransfer.setData("fromStatus", fromStatus);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = async (e: React.DragEvent, toStatus: string) => {
    e.preventDefault();
    setDraggedOver(null);
    const leadData = e.dataTransfer.getData("lead");
    const fromStatus = e.dataTransfer.getData("fromStatus");

    if (!leadData || !fromStatus || fromStatus === toStatus) return;

    const lead: Lead = JSON.parse(leadData);
    const updatedLead = { ...lead, status: toStatus };

    setGroupedLeads((prev) => ({
      ...prev,
      [fromStatus]: prev[fromStatus]?.filter((l) => l._id !== lead._id) || [],
      [toStatus]: [...(prev[toStatus] || []), updatedLead],
    }));

    try {
      const response = await fetch("http://localhost:8000/api/v1/lead/updateLeadStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead._id, status: toStatus }),
      });
      const data = await response.json();
      if (!data.success) throw new Error("Failed to update lead status on server.");
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
                                    <BreadcrumbLink href="/lead/leadDrop">
                                   
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
          const leadsInStatus = groupedLeads[status] || [];
          const totalAmount = leadsInStatus.reduce((sum, lead) => sum + lead.amount, 0);

          return (
            <div
              key={status}
              className={`p-4 rounded-lg  min-h-[530px] transition-all ${draggedOver === status }`}
              onDrop={(e) => handleDrop(e, status)}
              onDragOver={(e) => {
                e.preventDefault();
                setDraggedOver(status);
              }}
              onDragLeave={() => setDraggedOver(null)}
            >
              <h2 className={`text-sm font-bold mb-4 px-5 py-2 rounded-lg ${statusColors[status]}`}>{status}</h2>
              <div className="p-3 bg-white-200 rounded-md shadow">
                <p className="text-sm font-semibold text-gray-500">Total Leads: {leadsInStatus.length}</p>
                <p className="text-sm font-semibold text-gray-500">Total Amount: ₹{totalAmount}</p>
              </div>
              <div
                className="scrollable"
              >
                {leadsInStatus.length === 0 ? (
                  <p className="text-gray-500 text-center">No leads available</p>
                ) : (
                  leadsInStatus.map((lead) => (
                    <div
                    key={lead._id}
                    className="card-container"
                >
                    <div
                        className="card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead, status)}
                        onClick={() => handleLeadClick(lead)}
                    >
                      
                        <p>Company Name: <span>{lead.companyName}</span></p>
                        <p>Product: <span>{lead.productName}</span></p>
                        <p>Amount: <span>₹{lead.amount}</span></p>
                        <p>Next Date: <span>{formatDate(lead.endDate)}</span></p>
                       
                    </div>
                </div>
                
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="modal-content p-6 rounded-md shadow-lg w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Lead Details
              </h2>
              <button
                onClick={closeModal}
                className="text-xl font-semibold text-gray-600 hover:text-red-600"
              >
                <MdCancel />
              </button>
            </div>
            <div className="form-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
              {Object.entries(selectedLead)
                .filter(
                  ([key]) =>
                    !["_id", "isActive", "createdAt", "updatedAt"].includes(key)
                ) // Exclude _id, isActive, createdAt, updatedAt
                .map(([key, value]) => (
                  <p key={key} className="mb-4">
                    <strong>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </strong>{" "}
                    {key === "date" || key === "endDate"
                      ? value
                        ? new Date(value).toLocaleDateString()
                        : "N/A"
                      : value || "N/A"}
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </SidebarProvider>
  );
}
