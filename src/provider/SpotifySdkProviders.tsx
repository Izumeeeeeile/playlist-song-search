import { FC , createContext, useContext, ReactNode } from 'react';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { useSpotifySdk } from '../hooks/useSpotifySdk';

export type SpotifyContextType = {
    sdk: SpotifyApi | undefined
}

const spotifySdkContext = createContext<SpotifyContextType>({} as SpotifyContextType);


export const useSpotifySdkContext = ():SpotifyContextType => {
    return useContext<SpotifyContextType>(spotifySdkContext)
}

type AppProviderProps = {
    children: ReactNode;
};

export const SpotifySdkContextProvider: FC<AppProviderProps> = ({children}) => {
    const spotifysdK = useSpotifySdk();
    return (
        <spotifySdkContext.Provider value={{sdk: spotifysdK}}>
            {children}
        </spotifySdkContext.Provider>
    );
}