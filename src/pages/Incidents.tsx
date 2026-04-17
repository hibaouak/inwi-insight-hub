import { IncidentsTable } from "@/components/dashboard/IncidentsTable";

export default function Incidents() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
        <p className="text-sm text-muted-foreground mt-1">All open and recently-resolved incidents across Dynatrace and Salesforce</p>
      </div>
      <IncidentsTable />
    </div>
  );
}
