import React from 'react'
import type {Id} from '@openint/cdk'
import type {RouterOutput} from '@openint/engine-backend'
import {Badge, Card} from '../shadcn'
import {cn} from '../utils'

/** Can be img or next/image component */
type ImageComponent = React.FC<
  Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    'loading' | 'ref'
  >
>

interface UIPropsNoChildren {
  className?: string
  Image?: ImageComponent
}

interface UIProps extends UIPropsNoChildren {
  children?: React.ReactNode
}

type Integration = RouterOutput['listConfiguredIntegrations']['items'][number]

export const IntegrationCard = ({
  integration: int,
  className,
  children,
  ...uiProps
}: UIProps & {
  integration: Integration & {
    connectorName: string
    connectorConfigId?: Id['ccfg']
    envName?: string | null
  }
  className?: string
}) => (
  // <ConnectorCard
  //   {...props}
  //   showName={false}
  //   labels={int.envName ? [int.envName] : []}
  // />
  <Card
    className={cn(
      'm-3 flex h-36 w-36 flex-col items-center p-2 sm:h-48 sm:w-48',
      className,
    )}>
    <div className="flex h-6 self-stretch">
      <span className="text-sm text-muted-foreground">{int.name}</span>
      {int.envName && (
        <Badge key={int.envName} variant="secondary">
          {int.envName}
        </Badge>
      )}
      {/* {showStageBadge && (
        <Badge
          variant="secondary"
          className={cn(
            'ml-auto',
            connector.stage === 'ga' && 'bg-green-200',
            connector.stage === 'beta' && 'bg-blue-200',
            connector.stage === 'alpha' && 'bg-pink-50',
          )}>
          {connector.stage}
        </Badge>
      )} */}
    </div>
    <IntegrationLogoTemp
      {...uiProps}
      integration={int}
      // min-h-0 is a hack where some images do not shrink in height @see https://share.cleanshot.com/jMX1bzLP
      className="min-h-0 grow"
    />
    {children}
  </Card>
)

/** Dedupe me with ResourceCard.IntegrationLogo */
const IntegrationLogoTemp = ({
  integration: int,
  className,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  Image = (props) => <img {...props} />,
}: UIPropsNoChildren & {
  integration: Integration
}) =>
  int.logo_url ? (
    <Image
      width={100}
      height={100}
      src={int.logo_url}
      alt={`"${int.name}" logo`}
      className={cn('object-contain', className)}
    />
  ) : (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <span>{int.name}</span>
    </div>
  )
