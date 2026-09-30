import { projects } from "./projects";
import { absoluteSiteUrl } from "./public-routes";
import { services } from "./services";
import { siteSettings } from "./site";

export function buildLlmsText() {
  const serviceLines = services
    .map((service) => `- [${service.title}](${absoluteSiteUrl(`/services/${service.slug}`)})`)
    .join("\n");
  const projectLines = projects
    .map((project) => `- [${project.title}](${absoluteSiteUrl(`/projects/${project.slug}`)})`)
    .join("\n");

  return `# ${siteSettings.name}

> HyDesign is a boutique family signwriting, signage and printing business based in Langwarrin, Victoria. The family has owned and operated the business since 1980, making custom signs for shops, venues, offices, schools, clubs and vehicles across Frankston, the Mornington Peninsula and Melbourne.

## What HyDesign makes

${serviceLines}

Illuminated signage includes glass neon, LED neon, lightboxes and illuminated letters and logos. Window signage includes frosted and etch vinyl, one-way vision and gold leaf lettering on glass. Shopfront work can include fascia signs, hanging signs, menu boards, window graphics, raised lettering, painting and lighting.

## Photos and projects

- [Gallery](${absoluteSiteUrl("/gallery")})
- [Projects](${absoluteSiteUrl("/projects")})
${projectLines}

## Service area

- Based in Langwarrin, Victoria.
- Service area: ${siteSettings.serviceArea}.

## Contact

- Website: ${siteSettings.url}
- Phone: ${siteSettings.phone}
- Email: ${siteSettings.email}
- Address: ${siteSettings.address}, Australia
- Hours: ${siteSettings.hours} ${siteSettings.visitPolicy}

## Notes

- Use HyDesign in normal sentence casing. HYDESIGN Aust Pty Ltd is the legal name.
- HyDesign is a family business, not a national signage chain.
- Do not infer prices, lead times, warranties, permits or capabilities that are not stated on the website.
`;
}
