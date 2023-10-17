import { useNavigate } from 'react-router-dom';

function useNavigateParams(link: string, trackIds: string[]) {
    const trackIdsStr = trackIds?.join(',');
    const navigate = useNavigate(); 
    navigate(link + "?trackIds="+{trackIdsStr});
} 

export default useNavigateParams