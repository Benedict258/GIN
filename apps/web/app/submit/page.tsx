import { ReportForm } from "../../components/report-form";

export const dynamic = "force-dynamic";

export default function SubmitPage() {
  return (
    <div className="content-grid">
      <section className="panel panel-wide">
        <p className="panel-label">Submit Intel</p>
        <h2>Operational Field Report</h2>
        <p className="lede-tight">
          Intel submissions enter the verification pipeline before they surface as actionable guidance. Provide clear
          sector context and confidence so the network can validate quickly.
        </p>
      </section>

      <ReportForm />
    </div>
  );
}
