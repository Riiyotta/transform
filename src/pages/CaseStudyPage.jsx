import '../components/cms/cms.css'
import '../styles/page-case-study.css'
import DetailLayers from '../components/cms/DetailLayers'
import DetailHeader from '../components/cms/DetailHeader'
import CaseVariant from '../components/cms/CaseVariant'
import PostBody from '../components/cms/PostBody'
import ReadNext from '../components/cms/ReadNext'
import useDocumentTitle from '../components/cms/useDocumentTitle'
import Noise from '../components/ui/Noise'
import Cta from '../components/Cta'
import { getCaseStudy, localAsset, localAssetVariant } from '../data/cms'

// /case-studies/<slug> — specs/case-studies.md §4. The blog-post template with the `.cs` header
// (logo cell, divider) and one data-driven variant: highlight text (SBJ) or 2-stat block (TOC).
// The read-next section is visible here (one card: the other study). Unknown slug -> nothing
// page-specific (NotFound is the router's).
// MOTION: BLOG-M1, M2, M5 — load intro started on mount (D11); CS-M1 on the read-next card.
export default function CaseStudyPage({ params }) {
  const study = getCaseStudy(params[0])
  useDocumentTitle(study?.meta.title)
  if (!study) return null
  return (
    <>
      <DetailLayers />
      <DetailHeader
        cs
        media={
          <div className="post-img-vert-wrap cs post-page">
            <Noise className="stat-img" />
            <div className="cl-logo-overlay" />
            <img
              src={localAsset(study.logo)}
              srcSet={`${localAssetVariant(study.logo, '-p-500')} 500w, ${localAsset(study.logo)} 780w`}
              sizes="(max-width: 991px) 100vw, 780px"
              loading="lazy"
              alt={study.logoAlt}
              className="cl-logo-on-post"
            />
          </div>
        }
        backLink={study.backLink}
        title={study.title}
        bottom={<CaseVariant highlight={study.highlight?.text} stats={study.stats} postPage />}
      />
      <PostBody entry={study} />
      {study.readNext?.visible && <ReadNext readNext={study.readNext} />}
      <Cta />
    </>
  )
}
