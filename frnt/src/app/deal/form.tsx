"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required." }),
  customerName: z.string().min(2, { message: "Customer name must be at least 2 characters." }),
  contactNumber: z.string().optional(),
  emailAddress: z.string().email({ message: "Invalid email address" }),
  address: z.string().min(2, { message: "Address is required." }),
  productName: z.string().min(2, { message: "Product name is required." }),
  amount: z.number().positive({ message: "Amount must be positive." }),
  gstNumber: z.string().min(1, { message: "GST Number is required." }),
  status: z.enum(["New", "Discussion", "Demo", "Proposal", "Decided"]),
  date: z.date().optional(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
  isActive: z.boolean(),
});

export default function DealForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      customerName: "",
      contactNumber: "",
      emailAddress: "",
      address: "",
      productName: "",
      amount: 0,
      gstNumber: "",
      status: "New",
      date: new Date(),
      endDate: undefined,
      notes: "",
      isActive: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const method = "POST"; // Since there's no id, we are only creating a new deal
      const response = await fetch("/api/deal", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit the deal.");
      }

      toast({
        title: "Deal Created",
        description: `Your deal has been created successfully.`,
      });

      router.push(`/deal/${data.id}`); // Redirect to the deal details page
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error submitting the deal.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Enter amount" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="gstNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter GST number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select {...field} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="New">New</option>
                    <option value="Discussion">Discussion</option>
                    <option value="Demo">Demo</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Decided">Decided</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              "Creating Deal..."
            </>
          ) : (
            "Create Deal"
          )}
        </Button>
      </form>
    </Form>
  );
}
