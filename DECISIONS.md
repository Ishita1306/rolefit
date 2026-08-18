# ROLEFIT — Decisions

## 1. Why this approach over the obvious alternative?

I selected **Part 2 — The Premium Home Page**, so I did not implement the Part 1 scraping/ingestion track.

For the RoleFit prototype, I chose a **deterministic, client-side analysis approach** rather than relying on an external AI/NLP API. The main reason was explainability and reliability under the challenge time limit: every visible result can be traced back to the selected role, its extracted requirements, and the candidate-provided skills.

This also kept the core product interaction fast and predictable while allowing more time to focus on the part of the brief that mattered most for this track: visual craft, responsive behavior, and a meaningful product interaction.

## 2. One trade-off made under the time limit

I prioritized **one deeply designed interaction — the Role Signal Ocean — instead of building a complete recruitment platform**.

The Ocean makes the product idea immediately understandable: the job requirements become interactive signals, the candidate can identify what they bring, and gaps remain visible before the final qualitative application signal.

With a real week, I would improve the parser with a more robust section-aware skill ontology, support more JD formats, add persistent candidate profiles, and build production-grade authentication and storage.

## 3. AI tools and personal verification

AI tools were used during development for **implementation assistance, debugging, UI iteration, code suggestions, and copy refinement**.

I personally verified and iterated on the resulting implementation, especially:

- multi-role JD isolation
- required vs preferred skill classification
- skill normalization and duplicate prevention
- candidate matching and gap detection
- Role Signal Ocean interaction
- responsive behavior at 390px and 1440px
- keyboard, touch, and reduced-motion behavior
- visual hierarchy, spacing, motion, and interaction states
- production build correctness

The final product decisions were reviewed against the assignment requirements and tested through real JD examples rather than being accepted blindly from AI-generated output.
