import hash from 'object-hash';

const hashObject = (obj: any) => hash.MD5(obj);

export default hashObject;
