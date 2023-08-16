import { useNavigationState } from '@react-navigation/native';


const useActiveRoutes = () => useNavigationState(e => e.routes);
export default useActiveRoutes;