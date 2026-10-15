import { leads } from "@/lib/analytics";
import { PageHead } from "../../_ui/kit";
import { LeadInbox } from "./LeadInbox";

// Live data on every request.
export const instant = false;

export const metadata = { title: "Leads" };

export default async function Leads({ searchParams }: PageProps<"/admin/leads">) {
  const { id } = await searchParams;
  const rows = await leads();
  return (
    <>
      <PageHead title="Leads" sub="Call requests and contact-form messages. Send the booking link to good fits, and track each one from new to won." />
      <LeadInbox leads={rows} initial={Number(id) || rows[0]?.id || null} />
    </>
  );
}
