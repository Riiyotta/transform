Source: https://www.transform9.com/

# Asset manifest: Transform9 homepage

Inventory only. **Nothing was downloaded by Recon.** The main session copies local files from the snapshot folder and fetches MISSING items from their live URLs (per scope: private/internal use only).

- Snapshot folder (LOCAL_DIR): `/Users/riyaghosh/V3/transform/Transform9 — Maximize Every Call with a Custom AI Agent_files/`
- Live CDN base: `https://cdn.prod.website-files.com/684a82e3294991569082d379/`
- Dimensions are intrinsic pixels of the local file (from `sips`), or the width x height attributes and viewBox for SVGs. Rendered sizes are in CLONE_SPEC.md.
- "Live-loaded" means the request was seen during a full-scroll load at 1440. "not requested" means lazy (never scrolled into view) or a hidden state.
- Machine-readable version: `recon/assets.json`.

## Summary

- 85 assets are present in the snapshot `_files`.
- **Critical MISSING items (the page is visibly broken without them):** the PolySans Neutral woff2, the noise tile, stat-1..4 images, the CTA background, the security background, the hero video (mp4/webm) and its poster, and the tablet-pixels fallback still.
- MISSING but optional: the `-p-500/-p-800/-p-1080` responsive srcset variants (the base file is present and is the largest variant, so srcset can be dropped), the YouTube thumbnail (third-party), and the favicon, apple-touch icon and og:image.
- Strip: the LinkedIn noscript tracking pixel (`px.ads.linkedin.com/collect/?pid=8899442&fmt=gif`) and every HubSpot, Google or reCAPTCHA image or pixel.

## 1. Font

| Role | Live URL | Local | Format | Notes |
|---|---|---|---|---|
| PolySans Neutral, weight 400 normal (the only text face) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6883559817085db21b9e44bb_PolySans-Neutral.woff2` | **MISSING** | woff2 | Declared as `@font-face{font-family:"Polysans Neutral";font-weight:400;font-display:swap}` and preloaded. Fallback stack `Arial, sans-serif`. There are no other weights or styles. The HubSpot iframe uses Helvetica Neue (system font) internally. |

## 2. Video and motion media

| Role | Live URL | Local | Format / dims | Notes |
|---|---|---|---|---|
| Hero fixed background video (source) | `https://cdn.prod.website-files.com/684a82e3294991569082d379%2F6aae963300a522b95e867d73_Tablet-Final_mp4.mp4` | **MISSING** | mp4 · 520×720, 15.07s, loop, muted | first source |
| Hero fixed background video (source) | `https://cdn.prod.website-files.com/684a82e3294991569082d379%2F6aae963300a522b95e867d73_Tablet-Final_webm.webm` | **MISSING** | webm | second source (not requested by Chromium) |
| Hero fixed background video (poster) | `https://cdn.prod.website-files.com/684a82e3294991569082d379%2F6aae963300a522b95e867d73_Tablet-Final_poster.0000000.jpg` | **MISSING** | jpg | poster / inline background-image on the video |
| Hero bg still fallback (.bg-pic-pixels; shown when video not playing / reduced motion) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68aeb9fc729ad96012dc97f0_tablet-pixels.webp` | **MISSING** | webp | CSS bg of `.bg-pic-pixels`, cover |

There are no Lottie files, no canvas and no WebGL.

## 3. CSS background images

| Role | Live URL | Local | Format | Used by |
|---|---|---|---|---|
| Security rail background | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895cdd22ca44eb25a439eb2_secure.avif` | **MISSING** | avif | `.left-side.security` |
| CTA section background | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68947313a36aa178a65e0a40_cta-img-upd-2.webp` | **MISSING** | webp | `.cta-section` |
| Stats block 01 hover image | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6894e8a532e53804a41a1ea0_stat-1.webp` | **MISSING** | webp | `.stats-img` |
| Stats block 02 hover image | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6894f7026eba00805615d1aa_stat-2.webp` | **MISSING** | webp | `.stats-img._2` |
| Stats block 03 hover image | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6894f7029b2ee246309b15bd_stat-3.webp` | **MISSING** | webp | `.stats-img._3` |
| Stats block 04 hover image | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6894f7025b93ceead4351b6b_stat-4.webp` | **MISSING** | webp | `.stats-img._4` |
| Noise texture tile (.bg-noise, 200px) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6894eeb12060be5400f13d15_7f73b64e03536ee2d541bb35d323241b_noise.webp` | **MISSING** | webp | `.bg-noise` (all), `background-size:200px`, opacity .5/.3 |

The CSS also references `68951815c34e8af819012f49_bg-blur (1)…`, `6992da8bade6530f1dab73f8_call-blue.avif` and `69946c2576805aff36fcf31a_privacy-green.avif`, but **no homepage element uses them**, so they are not needed.

## 4. Brand, UI icons

| Role | Local file (in LOCAL_DIR) | Format | Intrinsic dims | Live URL | Live-loaded |
|---|---|---|---|---|---|
| Nav logo (white) + popup logo | `68639bb30a93107837363b04_logo-2.svg` | svg | 130x38 vb(0 0 130 38) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68639bb30a93107837363b04_logo-2.svg` | yes |
| Testimonial arrow right (white) | `687f9e315c0a9b7f071b0a0c_arrow.svg` | svg | 28x28 vb(0 0 28 28) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/687f9e315c0a9b7f071b0a0c_arrow.svg` | yes |
| Nav logo (black, on-white state) | `68906575d051bc5b61776ed5_logo-black.svg` | svg | 130x38 vb(0 0 130 38) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68906575d051bc5b61776ed5_logo-black.svg` | yes |
| Footer big logo | `68920b38695cade17f6e41a0_logo-footer.svg` | svg | 400x68 vb(0 0 400 68) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68920b38695cade17f6e41a0_logo-footer.svg` | yes |
| Mobile menu close icon (white) | `689caa3e67c8dbd2e70dc1bc_close-icon-white.svg` | svg | 24x24 vb(0 0 24 24) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/689caa3e67c8dbd2e70dc1bc_close-icon-white.svg` | yes |
| Popup close icon (white) | `689caa792a4b35f0e9aba831_close-icon-white-28.svg` | svg | 28x28 vb(0 0 28 28) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/689caa792a4b35f0e9aba831_close-icon-white-28.svg` | no |
| Burger icon (white) | `68a300503634463bc8a25527_menu-burger.svg` | svg | 24x24 vb(0 0 24 24) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68a300503634463bc8a25527_menu-burger.svg` | yes |
| Burger icon (black, on-white) | `68a5a50307e780f41451718b_menu-burger-close.svg` | svg | 24x24 vb(0 0 24 24) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68a5a50307e780f41451718b_menu-burger-close.svg` | yes |
| Testimonial arrow right (black, hover) | `68af321214fa5cc11e7994c7_arrow-black.svg` | svg | 28x28 vb(0 0 28 28) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68af321214fa5cc11e7994c7_arrow-black.svg` | yes |
| Testimonial arrow left (white) | `68af375b6ed817d8303e6d01_arrow-white-left.svg` | svg | 28x28 vb(0 0 28 28) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68af375b6ed817d8303e6d01_arrow-white-left.svg` | yes |
| Testimonial arrow left (black, hover) | `68af375bd94b22d7288ceba1_arrow-black-left.svg` | svg | 28x28 vb(0 0 28 28) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68af375bd94b22d7288ceba1_arrow-black-left.svg` | yes |
| Popup close icon (black, hover) | `68af7e1deaff18ed0b98d8fb_close-icon-black-28.svg` | svg | 28x28 vb(0 0 28 28) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68af7e1deaff18ed0b98d8fb_close-icon-black-28.svg` | no |

## 5. Client logo marquee

| Role | Local file (in LOCAL_DIR) | Format | Intrinsic dims | Live URL | Live-loaded |
|---|---|---|---|---|---|
| Client logo: Florida Orthopaedic Institute | `687f56a9063daee4443e46c2_Florida Orthopaedic Institute.svg` | svg | 107x50 vb(0 0 107 50) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/687f56a9063daee4443e46c2_Florida%20Orthopaedic%20Institute.svg` | yes |
| Client logo: Semmes Murphey | `687f56a9ad410e39b817c66b_Semmes Murphey.svg` | svg | 82x50 vb(0 0 82 50) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/687f56a9ad410e39b817c66b_Semmes%20Murphey.svg` | yes |
| Client logo: Hughston Clinic | `687f56a9e6245c0ab953f7e4_Hughston Clinic.svg` | svg | 103x50 vb(0 0 103 50) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/687f56a9e6245c0ab953f7e4_Hughston%20Clinic.svg` | yes |
| Client logo: Andrews Sports Medicine & Orthopaedic Center | `687f56b51adbdc9b529bd051_Andrews Sports Medicine & Orthopaedic Center.webp` | webp | 447x200 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/687f56b51adbdc9b529bd051_Andrews%20Sports%20Medicine%20%26%20Orthopaedic%20Center.webp` | yes |
| Client logo: The Orthopaedic Center | `687f56b54ba0d2c838ec91b8_The Orthopaedic Center.webp` | webp | 443x200 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/687f56b54ba0d2c838ec91b8_The%20Orthopaedic%20Center.webp` | yes |
| Client logo: Resurgens Orthopaedics | `687f56b5ced9a9f759250276_Resurgens Orthopaedics.webp` | webp | 492x200 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/687f56b5ced9a9f759250276_Resurgens%20Orthopaedics.webp` | yes |
| Client logo: TOC | `687f56b5d3a2aac73ec14171_TOC.webp` | webp | 280x200 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/687f56b5d3a2aac73ec14171_TOC.webp` | yes |
| Client logo: North Florida Surgeons | `687f56b5fdd0b924dce2982f_North Florida Surgeons.webp` | webp | 463x200 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/687f56b5fdd0b924dce2982f_North%20Florida%20Surgeons.webp` | yes |
| Client logo: c368d18a994e282d7dfe5cf55a05a981_CDC | `689498e02915466ba0586e2f_c368d18a994e282d7dfe5cf55a05a981_CDC.webp` | webp | 425x200 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/689498e02915466ba0586e2f_c368d18a994e282d7dfe5cf55a05a981_CDC.webp` | yes |
| Client logo: UMP | `689498e037cd46c41ab29712_UMP.svg` | svg | 114x50 vb(0 0 114 50) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/689498e037cd46c41ab29712_UMP.svg` | yes |
| Client logo: OSM | `689498e05d8d1f8f3b3cdf22_OSM.svg` | svg | 132x50 vb(0 0 132 50) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/689498e05d8d1f8f3b3cdf22_OSM.svg` | yes |
| Client logo: Armina (hidden, display:none) | `689498e0742068939dc61f59_Armina.webp` | webp | 378x200 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/689498e0742068939dc61f59_Armina.webp` | no |
| Client logo: Eye Doctors-p-500 (hidden, display:none) | **MISSING** (responsive srcset variant; the base file is present, so it is optional) | webp | – | `https://cdn.prod.website-files.com/684a82e3294991569082d379/689498e077a9e597323c706d_Eye%20Doctors-p-500.webp` | no |
| Client logo: Eye Doctors (hidden, display:none) | `689498e077a9e597323c706d_Eye Doctors.webp` | webp | 757x200 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/689498e077a9e597323c706d_Eye%20Doctors.webp` | no |
| Client logo: UCA (hidden, display:none) | `689498e0dcb8e3e1e573aa42_UCA.svg` | svg | 187x50 vb(0 0 187 50) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/689498e0dcb8e3e1e573aa42_UCA.svg` | no |
| Client logo: USOP | `689498e0f5c437f5bddc9fb7_USOP.webp` | webp | 297x200 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/689498e0f5c437f5bddc9fb7_USOP.webp` | yes |
| Client logo: SBJ_Logo_upscaled_200h-p-1080 | **MISSING** (responsive srcset variant; the base file is present, so it is optional) | png | – | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6a75e93f1d775f54a21ef4a2_SBJ_Logo_upscaled_200h-p-1080.png` | no |
| Client logo: SBJ_Logo_upscaled_200h-p-500 | **MISSING** (responsive srcset variant; the base file is present, so it is optional) | png | – | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6a75e93f1d775f54a21ef4a2_SBJ_Logo_upscaled_200h-p-500.png` | no |
| Client logo: SBJ_Logo_upscaled_200h-p-800 | **MISSING** (responsive srcset variant; the base file is present, so it is optional) | png | – | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6a75e93f1d775f54a21ef4a2_SBJ_Logo_upscaled_200h-p-800.png` | no |
| Client logo: SBJ_Logo_upscaled_200h | `6a75e93f1d775f54a21ef4a2_SBJ_Logo_upscaled_200h.png` | png | 1212x200 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6a75e93f1d775f54a21ef4a2_SBJ_Logo_upscaled_200h.png` | yes |

## 6. Testimonials

| Role | Local file (in LOCAL_DIR) | Format | Intrinsic dims | Live URL | Live-loaded |
|---|---|---|---|---|---|
| Testimonial 1 photo (Tammy Jackson) | **MISSING** (responsive srcset variant; the base file is present, so it is optional) | webp | – | `https://cdn.prod.website-files.com/684a82e3294991569082d379/687f914b39717f558eb082e8_Tammy%20Jackson-p-500.webp` | no |
| Testimonial 1 photo (Tammy Jackson) | `687f914b39717f558eb082e8_Tammy Jackson.webp` | webp | 770x1198 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/687f914b39717f558eb082e8_Tammy%20Jackson.webp` | yes |
| Testimonial 2 photo (Scott Griffin) | **MISSING** (responsive srcset variant; the base file is present, so it is optional) | webp | – | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68b03d1ff7bab6dbf46fb416_Scott%20Griffin-p-500.webp` | yes |
| Testimonial 2 photo (Scott Griffin) | `68b03d1ff7bab6dbf46fb416_Scott Griffin.webp` | webp | 770x1198 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68b03d1ff7bab6dbf46fb416_Scott%20Griffin.webp` | no |
| Testimonial 2 practice logo (SBJ) | **MISSING** (responsive srcset variant; the base file is present, so it is optional) | webp | – | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68b03e7aa72891aa77fb17bf_Southern%20Bone%20and%20Joint%20Specialists-p-500.webp` | yes |
| Testimonial 2 practice logo (SBJ) | `68b03e7aa72891aa77fb17bf_Southern Bone and Joint Specialists.webp` | webp | 821x200 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68b03e7aa72891aa77fb17bf_Southern%20Bone%20and%20Joint%20Specialists.webp` | no |

## 7. Stats

| Role | Local file (in LOCAL_DIR) | Format | Intrinsic dims | Live URL | Live-loaded |
|---|---|---|---|---|---|
| Stats rail gradient graphic | **MISSING** (responsive srcset variant; the base file is present, so it is optional) | webp | – | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6894e2b1ef0879a32ffdc2a5_gr-bl-p-500.webp` | no |
| Stats rail gradient graphic | `6894e2b1ef0879a32ffdc2a5_gr-bl.webp` | webp | 770x527 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6894e2b1ef0879a32ffdc2a5_gr-bl.webp` | yes |

## 8. Product sections (Scheduling / Tasking / Navigator / Outreach)

| Role | Local file (in LOCAL_DIR) | Format | Intrinsic dims | Live URL | Live-loaded |
|---|---|---|---|---|---|
| Outreach card icon 4 | `6883f1f3db0dc1ce3dd77736_out-icon-04.webp` | webp | 400x400 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6883f1f3db0dc1ce3dd77736_out-icon-04.webp` | yes |
| Outreach card icon 2 | `6883f34c4175e5ba20591b09_out-icon-02.webp` | webp | 401x400 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6883f34c4175e5ba20591b09_out-icon-02.webp` | yes |
| Outreach card icon 1 | `6883f34c4e63a9b69a4e5d84_out-icon-01.webp` | webp | 402x400 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6883f34c4e63a9b69a4e5d84_out-icon-01.webp` | yes |
| Outreach card icon 3 | `6883f34c5f69d9e9448db9e1_out-icon-03.webp` | webp | 400x400 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6883f34c5f69d9e9448db9e1_out-icon-03.webp` | yes |
| Outreach card icon 5 | `6883f34cf8d4db106318440c_out-icon-05.webp` | webp | 400x400 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6883f34cf8d4db106318440c_out-icon-05.webp` | yes |
| Scheduling card image 3 | `6895b5252492c7e65980a91c_6da87d9d094dc249ee70d2f8f5118203_sch-img-3.avif` | avif | 1200x1014 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895b5252492c7e65980a91c_6da87d9d094dc249ee70d2f8f5118203_sch-img-3.avif` | yes |
| Scheduling card image 1 | `6895b5254b12f4e9385d2b64_cb862a86e82892dd803115dfaf743bfe_sch-img-1.avif` | avif | 1200x1014 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895b5254b12f4e9385d2b64_cb862a86e82892dd803115dfaf743bfe_sch-img-1.avif` | yes |
| Scheduling card image 2 | `6895b52599b0bc61961ff546_d5924aa3dfe7c5f576623788a8ab5825_sch-img-2.avif` | avif | 1200x1014 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895b52599b0bc61961ff546_d5924aa3dfe7c5f576623788a8ab5825_sch-img-2.avif` | yes |
| Scheduling card image 4 | `6895b525dc871b1f5fe7bedd_721d1e1a3e576f29f09b75ccf4d7db9e_sch-img-4.avif` | avif | 1200x1014 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895b525dc871b1f5fe7bedd_721d1e1a3e576f29f09b75ccf4d7db9e_sch-img-4.avif` | yes |
| Tasking tab pane image 2 | `6895ba251b4a95b1e73b23cb_task-img-2.avif` | avif | 1440x1408 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895ba251b4a95b1e73b23cb_task-img-2.avif` | yes |
| Tasking tab pane image 3 | `6895ba252384e22761c55270_task-img-3.avif` | avif | 1440x1408 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895ba252384e22761c55270_task-img-3.avif` | yes |
| Tasking tab pane image 1 | `6895ba258eb91995c9cabdf4_task-img-1.avif` | avif | 1440x1408 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895ba258eb91995c9cabdf4_task-img-1.avif` | no |
| Navigator tab pane image 2 | `6895c0e0319951151e3843a6_nav-img-2.avif` | avif | 1155x1383 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c0e0319951151e3843a6_nav-img-2.avif` | yes |
| Navigator tab pane image 3 | `6895c0e06a401a644cf830cf_nav-img-3.avif` | avif | 1155x1383 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c0e06a401a644cf830cf_nav-img-3.avif` | yes |
| Navigator tab pane image 1 | `6895c0e0cf1da44572715af5_nav-img-1.avif` | avif | 1155x1383 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c0e0cf1da44572715af5_nav-img-1.avif` | yes |
| Navigator tab pane image 4 | `6895c0e0cf1da44572715af8_nav-img-4.avif` | avif | 1155x1383 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c0e0cf1da44572715af8_nav-img-4.avif` | yes |

## 9. Specialties

| Role | Local file (in LOCAL_DIR) | Format | Intrinsic dims | Live URL | Live-loaded |
|---|---|---|---|---|---|
| Specialty image: Podiatry | `6895c8130aef8550f8914df1_Podiatry.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c8130aef8550f8914df1_Podiatry.avif` | no |
| Specialty image: Cardiology | `6895c81330d7de744c894d94_Cardiology.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c81330d7de744c894d94_Cardiology.avif` | no |
| Specialty image: Orthopedics & physical therapy | `6895c81333b865db4669b970_Orthopedics & physical therapy.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c81333b865db4669b970_Orthopedics%20%26%20physical%20therapy.avif` | yes |
| Specialty image: Dentistry & oral surgery | `6895c81360d11952e57f20a5_Dentistry & oral surgery.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c81360d11952e57f20a5_Dentistry%20%26%20oral%20surgery.avif` | no |
| Specialty image: Dermatology | `6895c8137ad378e38fa08ace_Dermatology.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c8137ad378e38fa08ace_Dermatology.avif` | no |
| Specialty image: Gastroenterology | `6895c81395c7a4301f713ac0_Gastroenterology.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c81395c7a4301f713ac0_Gastroenterology.avif` | no |
| Specialty image: ENT | `6895c813e0cffd29d16ce36b_ENT.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c813e0cffd29d16ce36b_ENT.avif` | no |
| Specialty image: Ophthalmology & optometry | `6895c813f36a7703449637e1_Ophthalmology & optometry.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c813f36a7703449637e1_Ophthalmology%20%26%20optometry.avif` | no |
| Specialty image: Urology | `6895c8143c4bf61fa13f7d9d_Urology.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c8143c4bf61fa13f7d9d_Urology.avif` | no |
| Specialty image: Pediatrics | `6895c814821090042466ce03_Pediatrics.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c814821090042466ce03_Pediatrics.avif` | no |
| Specialty image: OBGYN | `6895c8149164418542e6e22f_OBGYN.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c8149164418542e6e22f_OBGYN.avif` | no |
| Specialty image: Neurology | `6895c814b7be66777d210654_Neurology.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c814b7be66777d210654_Neurology.avif` | no |
| Specialty image: Primary care | `6895c814d78925820018cebe_Primary care.avif` | avif | 1155x1389 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6895c814d78925820018cebe_Primary%20care.avif` | no |

## 10. Integrations

| Role | Local file (in LOCAL_DIR) | Format | Intrinsic dims | Live URL | Live-loaded |
|---|---|---|---|---|---|
| Integration: Athena (white) | **MISSING** (responsive srcset variant; the base file is present, so it is optional) | webp | – | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ba123690a20e001bdb40_athena-p-500.webp` | no |
| Integration: Athena (white) | `6891ba123690a20e001bdb40_athena.webp` | webp | 840x203 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ba123690a20e001bdb40_athena.webp` | yes |
| Integration: ModMed (white) | `6891ba294f620244fffc46c9_Frame-4.svg` | svg | 152x52 vb(0 0 152 52) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ba294f620244fffc46c9_Frame-4.svg` | yes |
| Integration: Epic (white) | `6891ba297394dd666fa1e80f_Frame-5.svg` | svg | 130x52 vb(0 0 130 52) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ba297394dd666fa1e80f_Frame-5.svg` | yes |
| Integration: Veradigm (white) | `6891ba297ca39dde65c0c5ec_Frame-1.svg` | svg | 198x52 vb(0 0 198 52) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ba297ca39dde65c0c5ec_Frame-1.svg` | yes |
| Integration: eClinicalWorks (white) | `6891ba29d55c22cffb383bb7_Frame-2.svg` | svg | 188x52 vb(0 0 188 52) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ba29d55c22cffb383bb7_Frame-2.svg` | yes |
| Integration: Nextech (white) | `6891ba29fbf92e334355779b_Frame.svg` | svg | 180x52 vb(0 0 180 52) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ba29fbf92e334355779b_Frame.svg` | yes |
| Integration: Greenway (white) | `6891bbbe34bdaeb7aad82ea6_GreenHealth-upd.svg` | svg | 160x52 vb(0 0 160 52) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891bbbe34bdaeb7aad82ea6_GreenHealth-upd.svg` | yes |
| Integration: Athena (hover) | **MISSING** (responsive srcset variant; the base file is present, so it is optional) | webp | – | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ca03471a3b7540d45c51_athena-black-p-500.webp` | no |
| Integration: Athena (hover) | `6891ca03471a3b7540d45c51_athena-black.webp` | webp | 840x201 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ca03471a3b7540d45c51_athena-black.webp` | yes |
| Integration: Epic (hover) | `6891ca1486c64ec6dcfdbd93_epic-black.svg` | svg | 130x51 vb(0 0 130 51) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ca1486c64ec6dcfdbd93_epic-black.svg` | yes |
| Integration: eClinicalWorks (hover) | `6891ca150e6e639c350e5305_eclinic-black.svg` | svg | 188x51 vb(0 0 188 51) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ca150e6e639c350e5305_eclinic-black.svg` | yes |
| Integration: Greenway (hover) | `6891ca151d6544e08918728b_greenway-black.svg` | svg | 160x51 vb(0 0 160 51) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ca151d6544e08918728b_greenway-black.svg` | yes |
| Integration: Nextech (hover) | `6891ca15287e4bd5ad5fcd73_nextech-black.svg` | svg | 180x51 vb(0 0 180 51) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ca15287e4bd5ad5fcd73_nextech-black.svg` | yes |
| Integration: ModMed (hover) | `6891ca15ec2bbcfee664f148_modmed-black.svg` | svg | 152x51 vb(0 0 152 51) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ca15ec2bbcfee664f148_modmed-black.svg` | yes |
| Integration: Veradigm (hover) | `6891ca15f5c11a916ba8c8b6_veradigm-black.svg` | svg | 198x51 vb(0 0 198 51) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ca15f5c11a916ba8c8b6_veradigm-black.svg` | yes |
| Integration: systemedx (white) | `6899beea881eb22496bfec6f_systemedx logo white.svg` | svg | 230x52 vb(0 0 230 52) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6899beea881eb22496bfec6f_systemedx%20logo%20white.svg` | yes |
| Integration: systemedx (hover) | `6899beee48af30a928765264_systemedx logo black.svg` | svg | 230x52 vb(0 0 230 52) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6899beee48af30a928765264_systemedx%20logo%20black.svg` | yes |
| Integration: NextGen (white) | `6899bf693aec41d6d19e938b_nextgen white.webp` | webp | 386x203 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6899bf693aec41d6d19e938b_nextgen%20white.webp` | yes |
| Integration: NextGen (hover) | `6899bf6d4e77eb1b7da9da53_nextgen black.webp` | webp | 386x202 | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6899bf6d4e77eb1b7da9da53_nextgen%20black.webp` | yes |

## 11. Security badges

| Role | Local file (in LOCAL_DIR) | Format | Intrinsic dims | Live URL | Live-loaded |
|---|---|---|---|---|---|
| NIST 800-53 badge (white) | `6891ebdb0ad3ebb68fe6d694_nist-white.svg` | svg | 235x132 vb(0 0 235 132) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ebdb0ad3ebb68fe6d694_nist-white.svg` | yes |
| NIST 800-53 badge (hover/black) | `6891ebdb7394dd666fb56b4e_nist-white-1.svg` | svg | 235x132 vb(0 0 235 132) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ebdb7394dd666fb56b4e_nist-white-1.svg` | yes |
| SOC 2 badge (white) | `6891ebdb97d9bef9310d4f85_soc-white.svg` | svg | 149x132 vb(0 0 149 132) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ebdb97d9bef9310d4f85_soc-white.svg` | yes |
| SOC 2 badge (hover/black) | `6891ebdb9f4ab9a258d517a7_soc-white-1.svg` | svg | 149x132 vb(0 0 149 132) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6891ebdb9f4ab9a258d517a7_soc-white-1.svg` | yes |
| NIST 800-30 badge (white) | `698db856e06a92021fdfd2d6_nist-2-white.svg` | svg | 234x132 vb(0 0 234 132) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/698db856e06a92021fdfd2d6_nist-2-white.svg` | yes |
| NIST 800-30 badge (hover/black) | `698db856fcc2fd567ffa01fe_nist-2-white-1.svg` | svg | 234x132 vb(0 0 234 132) | `https://cdn.prod.website-files.com/684a82e3294991569082d379/698db856fcc2fd567ffa01fe_nist-2-white-1.svg` | yes |

## 12. Third-party / external images

| Role | URL | Local | Notes |
|---|---|---|---|
| Client Spotlight YouTube thumbnail | `https://i.ytimg.com/vi/yG3PtcRGQLc/maxresdefault.jpg` (srcset `mqdefault.jpg` 320w, maxres 1280w; fallback `hqdefault.jpg`) | **MISSING** | Third-party (YouTube). Natural size 800×450 as loaded at DPR 1. Decision needed: hotlink or save locally. |
| LinkedIn noscript pixel | `https://px.ads.linkedin.com/collect/?pid=8899442&fmt=gif` | – | Tracking. **Strip.** |

## 13. Head / meta images (not in snapshot)

| Role | Live URL | Local |
|---|---|---|
| Favicon | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68b1a0c9c9ebd677661d6e72_Favicon.png` | **MISSING** |
| Apple touch icon | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68b1a1cfecdee53d15e5d2f9_Webclip-white.png` | **MISSING** |
| og:image | `https://cdn.prod.website-files.com/684a82e3294991569082d379/68b191f59984678d1bd51942_Open%20Graph-opt.png` | **MISSING** |

## 14. Inline SVG

- The YouTube play-button triangle is inline in `.yt-facade__play .code-embed`: `<svg viewBox="0 0 330 330" fill="currentColor"><path d="M37.728,328.12c2.266,1.256,4.77,1.88,7.272,1.88c2.763,0,5.522-0.763,7.95-2.28l240-149.999c4.386-2.741,7.05-7.548,7.05-12.72c0-5.172-2.664-9.979-7.05-12.72L52.95,2.28c-4.625-2.891-10.453-3.043-15.222-0.4C32.959,4.524,30,9.547,30,15v300C30,320.453,32.959,325.476,37.728,328.12z"/></svg>`, rendered 24×24.
- There are no other inline SVGs and no icon font (`webflow-icons` is declared but unused).

## 15. Snapshot `_files` that are NOT assets (scripts, tracking, or third-party). Do not copy.

`117158212.js`, `48695808.js`, `48695808(1).js`, `…hs_trackcode_48695808-1.0.6.js`, `…phx5m3xf-1.1.1.js`, `api.js`, `attributes.js`, `anchor.html`, `banner.js`, `bframe.html`, `collectedforms.js`, `f.txt`, `f(1).txt`, `form-124.js`, `gtm.js`, `gtm(1).js`, `insight.min.js`, `insight.old.min.js`, `js`, `js(1)`, `js(2)`, `js(3)`, `ns.html`, `oaiq.min.js`, `pixels.js`, `recaptcha__en.js`, `saved_resource*.html`, `styles__ltr.css`, `v2.js`, `zi-tag.js`, `jquery-3.5.1.min.dc5e7f18c8.js`, `webflow.*.js`, `gsap.min.js`, `ScrollTrigger.min.js`, `lenis.min.js`. `transform9.webflow.shared.8b0b439cc.css` is reference only; rules are extracted to `recon/homepage-rules.css`.

## Local file locations (added by main session, 2026-09-30)

- All media from the snapshot `_files` folder were copied to `public/assets/` with **sanitized names**: lowercased, and every run of non `[a-z0-9.]` characters replaced by `-`. The exact original→local mapping is `public/assets/_map.tsv` (tab-separated). Serve as `/assets/<name>`.
- Font: `public/fonts/PolySans-Neutral.woff2` (fetched from live).
- MISSING items fetched from live into `public/assets/`:
  `hero-tablet.mp4`, `hero-tablet.webm`, `hero-tablet-poster.jpg`, `tablet-pixels.webp`, `secure.avif`, `cta-img-upd-2.webp`, `stat-1.webp`…`stat-4.webp`, `noise.webp`, `favicon.png`, `webclip-white.png`, `yt-thumb.jpg` (YouTube maxres thumbnail, saved locally to avoid a third-party request).
- Not fetched (optional): `-p-500/-p-800/-p-1080` srcset variants (base files used), og:image.

## Decisions on recon's open questions
- YouTube thumbnail: local copy. Clicking behavior follows the original (see CLONE_SPEC §6), but no iframe is loaded until the user clicks.
- Reduced motion: faithful to original (only the background video respects it). No added handling.
- Footer HubSpot form + "Call Alex" popup: rebuilt as static React forms with the measured styles and client-side validation/success/error states; **no network calls**.
