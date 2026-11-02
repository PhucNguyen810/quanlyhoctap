import {useNetInfo} from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const {isConnected, isInternetReachable} = useNetInfo();
  return {isOnline: isConnected === true && isInternetReachable !== false};
}
