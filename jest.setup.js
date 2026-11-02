/* eslint-env jest */
jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({isConnected: true, isInternetReachable: true}),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => undefined),
    removeItem: jest.fn(async () => undefined),
  },
}));
