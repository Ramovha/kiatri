# Roadmap notes — internal, not site copy

This file tracks research and vendor asks that inform the site's "Coming Soon"
features but aren't themselves public content. See `lib/products.ts` →
`callCenterTiers` and the `addon-ai-receptionist` entry in `addons` for what
actually shipped to the site from this research.

## What shipped to the site (from the Sept 2026 Enterprise/AI research)
- **Call Center Pro** (R899/mo illustrative, add-on to any PBX tier) and
  **Enterprise** ("Talk to us", up to 50+ agents) tiers on `/pricing`, each
  with per-feature Available/Coming Soon labeling.
- **AI Virtual Receptionist** addon card, Coming Soon, no price — pricing
  model needs to be usage/minute-based (see cost data below), not flat.

## Deferred — NOT built into the site yet, and why

**US/Canada Virtual Number (via VoIP.ms)** — not added. The research's own
Part B5 says the first required step is confirming directly with VoIP.ms
whether they offer anything for South Africa at all; their published
materials only confirm US & Canada coverage. Publishing this product before
that confirmation risks promising something we can't deliver. Build this
once VoIP.ms coverage/feasibility is confirmed, not before.

**VoIP.ms self-service ordering** — explicitly out of scope per the source
research ("Do not build a VoIP.ms self-service ordering flow into the
website — that's a backend provider-routing decision, not a public product
page change").

## Feature requests to send to ictVoIP (Jim) — action item, not a site task

1. Expose FusionPBX's native call recording (and its transcription
   capability) through ictVoIP Box's client-facing portal — currently only
   CDRs, fax, and voicemail panels are documented as client-facing.
2. Expose FusionPBX's native Active Call Center / Active Queues / Agent
   Status real-time views through the client or admin portal — this data
   already exists in FusionPBX's own Status menu.
3. Confirm VoIP.ms provider parity with DIDWW inside ictVoIP Box
   specifically (not just ictVoIP Billing) — is VoIP.ms available as a
   provider option in the DID-ordering/regulatory workflow, or only DIDWW?
4. Ask whether VoIP.ms's AI Voice Agent and SMS/MMS features are exposed or
   reachable through the VoIP.ms server module at all — this determines how
   fast the VoIP.ms-partnership track of the AI Voice Assistant could ship.
5. Ask whether VoIP.ms's coverage extends to South Africa at all — ictVoIP
   may already know from prior deployments, saving a direct VoIP.ms sales
   inquiry.

## Reference: real cost data behind the AI Virtual Receptionist's eventual pricing

Raw component costs (2026, multiple sourced vendors) — do not publish a firm
rate until a real prototype exists and is tested, but use this to ground
whatever rate is eventually set:
- Speech-to-text: $0.0077–$0.024/min
- LLM processing: $0.003–$0.04/min
- Text-to-speech: $0.02–$0.06/min
- All-in raw stack: ~$0.007–$0.10/conversation-minute
- Market retail rate (what platforms actually charge): $0.05–$0.35/minute
- A sustainable retail rate would need to sit meaningfully above raw cost —
  roughly $0.15–$0.30/min based on market comparables — likely plus a base
  monthly fee to cover per-business setup/training time.

## Reference: FusionPBX capabilities already confirmed, not yet all surfaced to customers

Per docs.fusionpbx.com: Call Center/ACD (agent tiers, queues, skills-based
routing basics), call recording **with transcription**, voicemail
transcription, text-to-speech for recordings, multi-level IVR, Conference
Center, Fax Server, Call Broadcast, Follow Me/Hot Desking, Ring Groups, Time
Conditions, Call Block/Blacklist, exportable CDR reporting, and real-time
Active Call Center/Queue/Agent Status views. Most of this is genuinely
running in FusionPBX today — the gap is that it isn't yet exposed through
ictVoIP Box's client-facing portal (see feature requests above), which is
why the site marks recording-transcription and the real-time dashboard as
"Coming Soon" rather than "Available" despite the underlying capability
existing.

**QueueMetrics** is the proof-of-concept precedent that a proper real-time
analytics/wallboard product is realistic to build or integrate for this
exact stack (FusionPBX + `mod_callcenter`) — someone has already done it.
