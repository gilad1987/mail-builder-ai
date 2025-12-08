import { observer } from 'mobx-react-lite'
import { editorStore } from '../../../stores/EditorStore'
import { ResponsiveIcon } from '../ResponsiveIcon'
import { BorderRadiusSection } from './BorderRadiusSection'
import { BorderSideSection } from './BorderSideSection'

export const BorderController = observer(() => (
  <div className="style-field border-controller">
    <div className="style-field__header">
      <div className="style-field__label">
        Border
        <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
      </div>
    </div>

    <BorderRadiusSection />

    <hr className="border-controller__divider" />

    <BorderSideSection />
  </div>
))
