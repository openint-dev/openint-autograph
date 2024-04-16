import {z} from '@opensdks/util-zod'
import {createEnv} from '@t3-oss/env-nextjs'
import {proxyRequired} from './proxyRequired'

export const MGMT_PROVIDER_NAME = z.enum(['supaglue', 'nango'])

export const env = createEnv({
  server: {
    // Core env vars
    POSTGRES_URL: z.string().default('postgres://localhost:5432/postgres'),
    NANGO_SECRET_KEY: z.string().optional(),
    SUPAGLUE_API_KEY: z.string().optional(),
    SUPAGLUE_APPLICATION_ID: z.string().default('byos'),
    MGMT_PROVIDER_NAME: MGMT_PROVIDER_NAME.default('nango').describe(
      'Default management provider (csutomers, credentials)',
    ),

    NANGO_NO_ID_PREFIX: z
      .string()
      .optional()
      .describe(
        'When true, we will not add cus_ or ccfg_ to the id when converting to & from Nango. ' +
          'This is useful if you already have a nango instance with existing IDs in it that is hard to migrate',
      ),

    // For sync
    CONFIG_SCHEMA: z.string().optional(),
    DESTINATION_SCHEMA: z.string().optional(),

    // Required for worker to work when deployed
    INNGEST_SIGNING_KEY: z.string().optional(),
    INNGEST_EVENT_KEY: z.string().optional(),

    // Set if you want to receive webhooks for all the events
    WEBHOOK_URL: z.string().optional(),
    WEBHOOK_SECRET: z.string().optional(),

    // Variables set by Vercel when deployed
    VERCEL_URL: z.string().optional(),

    // Used for scripts / cli only, maybe we should rename them to all _ prefixed to be clear?
    PROVIDER_NAME: z.string().optional(),
    CUSTOMER_ID: z.string().optional(),
    // Redundant with NEXT_PUBLIC_SERVER_URL, but shorter and for script only
    BYOS_URL: z.string().optional(),
    SFDC_INSTANCE_URL: z.string().optional(),
    SFDC_ACCESS_TOKEN: z.string().optional(),
    CONNECTION_ID: z.string().optional(),
    PROVIDER_CONFIG_KEY: z.string().optional(),
    VERTICAL: z.enum(['crm', 'engagement']).optional(),
    UNIFIED_OBJECT: z
      .enum(['account', 'contact', 'opportunity', 'lead', 'user'])
      .optional(),
    SYNC_MODE: z.enum(['incremental', 'full']).optional(),
    PAGE_SIZE: z.string().optional(), // TODO: parse number / boolean from str

    // Turn on debug output, including drizzle. Should be a boolean tho
    DEBUG: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.string().optional(),
    NEXT_PUBLIC_NANGO_PUBLIC_KEY: z.string().optional(),
    // Where the app is running. Only used by getServerUrl at the moment
    NEXT_PUBLIC_PORT: z.string().optional(),
  },
  runtimeEnv: {
    BYOS_URL: process.env['BYOS_URL'],
    CONFIG_SCHEMA: process.env['CONFIG_SCHEMA'],
    CONNECTION_ID: process.env['CONNECTION_ID'],
    CUSTOMER_ID: process.env['CUSTOMER_ID'],
    DEBUG: process.env['DEBUG'],
    DESTINATION_SCHEMA: process.env['DESTINATION_SCHEMA'],
    INNGEST_EVENT_KEY: process.env['INNGEST_EVENT_KEY'],
    INNGEST_SIGNING_KEY: process.env['INNGEST_SIGNING_KEY'],
    MGMT_PROVIDER_NAME: process.env['MGMT_PROVIDER_NAME'],
    NANGO_NO_ID_PREFIX: process.env['NANGO_NO_ID_PREFIX'],
    NANGO_SECRET_KEY: process.env['NANGO_SECRET_KEY'],
    NEXT_PUBLIC_NANGO_PUBLIC_KEY: process.env['NEXT_PUBLIC_NANGO_PUBLIC_KEY'],
    NEXT_PUBLIC_PORT: process.env['NEXT_PUBLIC_PORT'],
    NEXT_PUBLIC_SERVER_URL: process.env['NEXT_PUBLIC_SERVER_URL'],
    PAGE_SIZE: process.env['PAGE_SIZE'],
    POSTGRES_URL: process.env['POSTGRES_URL'],
    PROVIDER_CONFIG_KEY: process.env['PROVIDER_CONFIG_KEY'],
    PROVIDER_NAME: process.env['PROVIDER_NAME'],
    SFDC_ACCESS_TOKEN: process.env['SFDC_ACCESS_TOKEN'],
    SFDC_INSTANCE_URL: process.env['SFDC_INSTANCE_URL'],
    SUPAGLUE_API_KEY: process.env['SUPAGLUE_API_KEY'],
    SUPAGLUE_APPLICATION_ID: process.env['SUPAGLUE_APPLICATION_ID'],
    SYNC_MODE: process.env['SYNC_MODE'],
    UNIFIED_OBJECT: process.env['UNIFIED_OBJECT'],
    VERCEL_URL: process.env['VERCEL_URL'],
    VERTICAL: process.env['VERTICAL'],
    WEBHOOK_SECRET: process.env['WEBHOOK_SECRET'],
    WEBHOOK_URL: process.env['WEBHOOK_URL'],
  },
})

export const envRequired = proxyRequired(env, {
  formatError(key) {
    return new Error(`Missing required env var: ${key}`)
  },
})
