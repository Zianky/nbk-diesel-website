# NBK Diesel Trading LLC website

Corporate website prepared for https://www.nbkdiesel.ae/. Source of public business information: the supplied NBK Diesel Company Profile 2026 and company logo. No banking agreements or personal identity documents are included. The company profile PDF is not distributed with the website.

## Preview

Serve the `dist` folder with any static HTTP server. No build or installation is required.

## Features

Responsive English corporate website with four trading activities, company details, an enquiry guide, two licensed industry films and direct email contact. Each product link selects the corresponding enquiry category. Local fonts and native video avoid third-party font requests and video embeds. Animations respect reduced-motion and data-saving preferences; mobile visitors see a static opening image unless they choose playback.

The enquiry composer does not submit or store data. The contact and enquiry destination is info@nbkdiesel.ae, as explicitly requested by the user. Mailbox provisioning and delivery are separate from the static website.

The proprietor's name is excluded from public pages. A commercial disclaimer is linked from the homepage, enquiry composer and legal/footer navigation. The disclaimer does not substitute for required licences, actual data-protection measures or the terms of a signed transaction agreement.

The enquiry composer includes optional specification, quantity, destination and delivery-period fields. Product selections carry through to the form, and the requirements diagram can open the corresponding detail field. These inputs are processed locally and included only in the prepared email; no enquiry database or analytics has been added. Run `node check-experience.cjs` to verify these connections. The native FAQ disclosures work without JavaScript.

## Publication

Publish `dist` using any static hosting provider. Domain connection and DNS are separate steps. Do not change existing email/MX records. Confirm domain ownership and the selected host before applying DNS changes. Update canonical and sitemap if the final domain changes.

Company profile retains its original .com reference. No unverified certifications, customers, quantities, supply guarantees or performance statistics have been added.

## Verification

Run `node check-enquiry.cjs`, `node check-site.cjs`, `node check-design.cjs`, `node --check dist/script.js`, `node --check dist/interactions.js` and `node --check dist/design.js` from the project directory. Checks cover email composition, validation guard, long-message fallback, clipboard failure, product selection, local page and media references, anchor IDs, metadata, profile removal, font licences, MP4 signatures and key text contrast ratios. Interactive design checks cover keyboard product selection, panel visibility, requirement details, SVG focus position and graphic pause. Native email delivery and actual provider retention are not established by these checks.
