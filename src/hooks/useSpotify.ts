import { useEffect, useRef, useState } from 'react'
import { SpotifyApi, SdkOptions, AuthorizationCodeWithPKCEStrategy } from '@spotify/web-api-ts-sdk';

export function useSpotify(
    clientId: string,
    redirectUrl: string,
    scopes: string[],
    config?: SdkOptions
) {

    const [sdk, setSdk] = useState<SpotifyApi | null>(null);
    const { current: activeScopes } = useRef(scopes);

    useEffect(() => {
        // OAuthで認証認可する
        const auth = new AuthorizationCodeWithPKCEStrategy(
            clientId, 
            redirectUrl,
            activeScopes
        );
        const spotifyApi = new SpotifyApi(
            auth,
            config
        );
        (async () => {
            try {
                // 最初の認証とリダイレクトを実施する。
                const { authenticated } = await spotifyApi.authenticate();

                if (authenticated) {
                    // 認証に成功した場合は戻り値用にstateにも設定しておく
                    setSdk(() => spotifyApi);
                }
            } catch (e: Error | unknown) {
                const error = e as Error;
                if (error && error.message && error.message.includes("No verifier found in cache")) {
                    console.error("ReactでUseEffectを2回呼び出した場合のみこのエラーになるらしい", error);
                } else {
                    console.error(e);
                }
            }
        })();
    }, [clientId, redirectUrl, config, activeScopes]);

    return sdk;
}