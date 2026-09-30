import '../components/cms/cms.css'
import '../styles/page-case-studies-index.css'
import IndexHero from '../components/cms/IndexHero'
import ListSection from '../components/cms/ListSection'
import CaseCard from '../components/cms/CaseCard'
import Cta from '../components/Cta'
import { caseStudiesIndex } from '../data/cms'

// /case-studies — specs/case-studies.md §3. Same shell and load intro as the blog index, no
// featured post, no "All Articles" head, no pagination.
// MOTION: BLOG-M1..M4 — load intro (6 H1 words), started on mount (D11).
export default function CaseStudiesIndexPage() {
  return (
    <>
      <IndexHero heading={caseStudiesIndex.heroHeading} cs />
      <ListSection id="all-case-studies" cs label={caseStudiesIndex.leftLabel}>
        {caseStudiesIndex.list.map((item) => (
          <CaseCard key={item.href} item={item} />
        ))}
      </ListSection>
      <Cta />
    </>
  )
}
