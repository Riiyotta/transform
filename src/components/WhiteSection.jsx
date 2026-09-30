import '../styles/white-section.css'
import TransitionPixels from './TransitionPixels'
import SchedulingAgent from './SchedulingAgent'
import TaskingAgent from './TaskingAgent'
import NavigatorAgent from './NavigatorAgent'
import OutreachAgent from './OutreachAgent'

// section.white-section (CLONE_SPEC §10). Its bounds drive the navbar on-white state (M4).
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
