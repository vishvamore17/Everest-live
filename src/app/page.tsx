import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import Page from "./dashboard/page";

export default function Home() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* <LoginForm/> */}
      <Page />
    </div>
  );
}
