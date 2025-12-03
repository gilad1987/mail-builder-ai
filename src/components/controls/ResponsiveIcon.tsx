import { Monitor, Tablet, Smartphone } from 'lucide-react'

type DeviceType = 'desktop' | 'tablet' | 'mobile'

interface ResponsiveIconProps {
  device: DeviceType
  responsive?: boolean
}

export const ResponsiveIcon = ({ device, responsive = true }: ResponsiveIconProps) => {
  if (!responsive) return null

  const iconMap = {
    desktop: { Icon: Monitor, className: 'responsive-icon--desktop' },
    tablet: { Icon: Tablet, className: 'responsive-icon--tablet' },
    mobile: { Icon: Smartphone, className: 'responsive-icon--mobile' },
  }

  const { Icon, className } = iconMap[device]
  return <Icon size={14} className={`responsive-icon ${className}`} />
}
