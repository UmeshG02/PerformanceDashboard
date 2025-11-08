import Dashboard from "@/components/Dashboard";
import { DataProvider } from "@/components/providers/DataProvider";

export default async function Page() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  );
}
