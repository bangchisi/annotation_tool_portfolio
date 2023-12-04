type StorageItemType = AuthStorageData | SomeStorageData;

interface AuthStorageData {
  key: 'authToken';
  value: {
    token: string;
    expiredTime: number;
  };
}

interface SomeStorageData {
  key: 'someData';
  value: {
    data1: number;
    data2: string;
  };
}

export const setSessionStorage = <T extends StorageItemType>(
  storageKey: T['key'],
  value: T['value'],
) => {
  sessionStorage.setItem(storageKey, JSON.stringify(value));
};

export const getSessionStorage = <T extends StorageItemType>(
  storageKey: T['key'],
): T['value'] | null => {
  const data = sessionStorage.getItem(storageKey);

  if (data) {
    return JSON.parse(data);
  }
  return null;
};
