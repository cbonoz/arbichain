import { FleekSdk, ApplicationAccessTokenService } from '@fleekxyz/sdk';

const applicationService = new ApplicationAccessTokenService({
    clientId: process.env.NEXT_PUBLIC_FLEEK_CLIENT_ID as string,
})

export const fleekSdk = new FleekSdk({ accessTokenService: applicationService })