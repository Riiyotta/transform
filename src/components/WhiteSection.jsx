import '../styles/white-section.css'
import TransitionPixels from './TransitionPixels'
import SchedulingAgent from './SchedulingAgent'
import TaskingAgent from './TaskingAgent'
import NavigatorAgent from './NavigatorAgent'
import OutreachAgent from './OutreachAgent'

// section.white-section (CLONE_SPEC §10): 10a transition, 10b Scheduling #1,
// 10c Tasking #2, 10d Navigator #3, 10e Outreach #4.
// Its bounds drive the navbar on-white state (M4) — keep data-section="white-section".
export default function WhiteSection() {
  return (
    <section data-section="white-section" className="white-section">
      <TransitionPixels variant="black-to-white" />
      <SchedulingAgent />
      <TaskingAgent />
      <NavigatorAgent />
      <OutreachAgent />
    </section>
  )
}
