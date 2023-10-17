import { FC, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { SpotifyApi, Playlist, Page, PlaylistedTrack, MaxInt } from '@spotify/web-api-ts-sdk';
import { useSpotifySdkContext } from "../provider/SpotifySdkProviders";

function SearchPlaylists() {
    const sdk = useSpotifySdkContext().sdk;

    return sdk
        ? (<SpotifyPlaylists sdk={sdk} />)
        : (<></>);
}

function SpotifyPlaylists({ sdk }: { sdk: SpotifyApi }) {
    const [playlistDetails, setPlaylistDetail] = useState<Playlist[]>([]);
    const [trackIdMap, setTrackIdMapState] = useState<Map<string, string[][]>>(new Map<string, string[][]>());
    useEffect(() => {
        (async () => {
            const profile = await sdk.currentUser.profile();

            const playlists = await sdk.playlists.getUsersPlaylists(profile.id);
            
            const playlistTrackIds: string[] = playlists.items.map((item) => item.id);

            const playlistDetails: Playlist[] = await Promise.all(
                playlistTrackIds.map(async (trackId) => {
                    let playlist = await sdk.playlists.getPlaylist(trackId);
                    return playlist;
                })
            );
            setPlaylistDetail(() => playlistDetails)

            const trackIdMap : Map<string, string[][]> = await setTrackIdsMap(playlistDetails, sdk);
            setTrackIdMapState(trackIdMap);
        })();
    }, [sdk]);

    return (
        <>
            <div className="content">
                <PlaylistsItem playlistDetails={playlistDetails} trackIdMap={trackIdMap} />
            </div>
        </>
    );
};


interface Props {
    playlistDetails: Playlist[],
    trackIdMap: Map<string, string[][]>
}

const PlaylistsItem: FC<Props> = (props) => {
    return <div className="main-area">
            <h1>Playlist一覧</h1>
            {playlistItemDom(props.playlistDetails, props.trackIdMap)}
        </div>;
};

const sImageStyles = {
    width: 100,
    height: 100
};

const playlistItemDom = (playlistDetails: Playlist[], trackIdMap: Map<string, string[][]>) => 
    Object.values(playlistDetails).map((playlistDetail) => {
    
    const linkstr = "/playlistTracks?playListId=" + playlistDetail.id
    const trackIdMapData = trackIdMap.get(playlistDetail.id);
    return (
        <div className='list-items'>
            <div role='button' className="playlistDetail">
                <div className='item-list-image-area'>
                    <div style={sImageStyles}>
                        <img className="s-image" src={playlistDetail.images[0].url}></img>
                    </div>
                </div>
                <div className='playlistInfo'>
                    <div className='header-info-area'>
                        <p className="playlistName">
                            {playlistDetail.name}
                        </p>
                        <div>
                            <span>{playlistDetail.owner.display_name}</span>
                        </div>
                    </div>
                </div>
            </div>
            <Link to = {linkstr} state={{trackIdMapData : trackIdMapData , playlistName: playlistDetail.name}}>開く</Link>
        </div>
    )
});

// https://zenn.dev/nbr41to/articles/e76c41cb9032cd
const getParams = (params: string): { [key: string]: string } => {
    const paramsArray = params.split('?')[1].split('&')
    const paramsObject: { [key: string]: string } = {}
    paramsArray.forEach(param => {
      paramsObject[param.split('=')[0]] = param.split('=')[1]
    });
    return paramsObject;
}

const sliceByNumber = (array: string[], limit: number) => {
    return array.flatMap((_, i, a) => i % limit ? [] : [a.slice(i, i + limit)]);
}

const setTrackIdsMap = async (playlistDetails: Playlist[], sdk: SpotifyApi) => {   
    const trackIdMap = new Map<string, string[][]>();
    for (const d of playlistDetails) {
        const tracks = d.tracks;
        if (tracks.total >= 100) {
            let offset = tracks.next != undefined 
                            ? Number(getParams(tracks.next)["offset"]) 
                            : undefined
                            
            let sincelist = sliceByNumber(tracks.items?.map((d) => d.track.id), 50)
            trackIdMap.set(d.id, sincelist);
                            
            while (offset !== undefined) {

                let playlistItems = await sdk.playlists.getPlaylistItems(
                    d.id,
                    undefined,
                    undefined,
                    undefined,
                    offset
                );
                let trackIds = trackIdMap.get(d.id);
                if (trackIds) {
                    let offsetPlayListMapTrackIds = playlistItems.items?.map(
                        (d) => d.track.id
                        )
                    let sincelist = sliceByNumber(offsetPlayListMapTrackIds, 50)
                    sincelist.map(s => trackIds?.push(s))
                    trackIdMap.set(d.id, trackIds)
                }

                offset = playlistItems.next != undefined 
                            ? Number(getParams(playlistItems.next)["offset"]) 
                            : undefined
            }
        } else {
            trackIdMap.set(d.id, [tracks.items?.map((d) => d.track.id)]);
        }
    };
    return trackIdMap;
}

export default SearchPlaylists;


