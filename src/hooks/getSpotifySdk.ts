import { Scopes} from '@spotify/web-api-ts-sdk';
import { useSpotify } from '../hooks/useSpotify';

export function useSpotifySdk() {
    const clientId :string = process.env.REACT_APP_SPOTIFY_CLIENT_ID === undefined ? "" : process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = `${window.location.origin}`+"/playLists"; 
    const sdk = useSpotify(
      clientId, 
      redirectUri, 
      Scopes.userDetails
    );
  
    if (!sdk) {
      return;
    }
  
    return sdk;
}