# NBK interactive design revision

Reference sites reviewed on 20 November 2026:

- https://www.vitol.com/ — clear product-led navigation and separation of activities.
- https://www.trafigura.com/what-we-do/oil-and-petroleum-products/ — connections between products, infrastructure and the supply chain.

These informed content hierarchy and interaction choices. No competitor brand assets, copy, operating statistics, locations or scale claims were reused.

NBK-specific implementation: an original SVG contour composition over the existing refinery film; a four-category keyboard-accessible product selector; an interactive enquiry-requirements diagram; selected-section navigation; and a pause control for graphic animation. The diagram describes enquiry information, not shipment routes or owned assets. All four product descriptions remain visible without JavaScript. No new analytics or browser storage is used.

Checks: `node check-site.cjs`, `node check-enquiry.cjs`, `node check-design.cjs`, and JavaScript syntax checks. Browser visual QA remains unverified because the available desktop browser control could not reliably identify its target URL in the preceding review.
