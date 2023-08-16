import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

const useTypedNavigation = () => useNavigation<NativeStackNavigationProp<RootStackParamList>>();

export default useTypedNavigation;