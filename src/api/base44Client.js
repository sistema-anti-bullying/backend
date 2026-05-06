import { Base44App } from '@base44/sdk'
import { appParams } from '@/lib/app-params'

// Initialize Base44 SDK
const base44 = new Base44App({
  appId: appParams.appId || 'default_app',
  baseUrl: appParams.appBaseUrl || 'https://api.base44.com',
  functionsVersion: appParams.functionsVersion || 'v1',
  token: appParams.token
})

export { base44 }
export default base44
