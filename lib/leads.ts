// Shape captured by the /get-started lead-capture flow. Kept separate from
// lib/products.ts since this isn't catalog data — it's the payload sent
// once a visitor answers the flow's questions and provides contact details.
export interface LeadPayload {
  audience: 'personal' | 'business';
  answers: Record<string, string>;
  name: string;
  email: string;
  phone: string;
  company?: string;
  consent: boolean;
  outcome: 'order' | 'callback' | 'custom-quote';
  recommendedPlanId?: string;
  recommendedPlanName?: string;
}

// TODO: wire this up to the real lead pipeline once that destination is
// decided (CRM, an email notification, a WHMCS ticket, etc. — not yet
// chosen). This function is the ONLY thing that needs to change once it
// is — every call site in components/GetStartedFlow.tsx stays the same.
// For now it just logs, so the flow's confirmation states (order handoff,
// "we'll call you") work end-to-end during testing before a real backend
// exists, rather than the page silently doing nothing on submit.
export async function submitLead(payload: LeadPayload): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('[kiatri lead capture — not yet wired to a backend]', payload);
  return Promise.resolve();
}
