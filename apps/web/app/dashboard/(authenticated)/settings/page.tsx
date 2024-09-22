'use client'

import type {AppRouter} from '@openint/api'
import {zOrganization} from '@openint/api/platform-models'
import type {TRPCReact} from '@openint/engine-frontend'
import {_trpcReact, useMutationToast} from '@openint/engine-frontend'
import {SchemaForm} from '@openint/ui'

const trpcReact = _trpcReact as unknown as TRPCReact<AppRouter>

export default function SettingsPage() {
  const res = trpcReact.getCurrentOrganization.useQuery()

  const updateOrg = trpcReact.updateCurrentOrganization.useMutation({
    ...useMutationToast({
      successMessage: 'Organization updated',
      errorMessage: 'Failed to save organization',
    }),
  })

  if (!res.data) {
    return null
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Settings</h2>
      {/* <div>Webhook url URL</div> */}

      <SchemaForm
        schema={zOrganization.shape.publicMetadata.pick({
          database_url: true,
        })}
        uiSchema={{
          // Would be nice if this can be extracted from example field of the openapi spec
          database_url: {
            'ui:placeholder': 'postgres://username:password@host:port/database',
          },
        }}
        formData={res.data.publicMetadata}
        loading={updateOrg.isLoading}
        onSubmit={({formData}) => {
          updateOrg.mutate({publicMetadata: formData})
        }}
      />
    </div>
  )
}
