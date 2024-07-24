const { Storage } = require('@google-cloud/storage');
const path = require('path');

class StorageSingleton {
  constructor() {
    throw new Error("Use StorageSingleton.getStorage() or StorageSingleton.getBucket()");
  }

  static getInstance() {
    if (!StorageSingleton.instance) {
      const keyFilenamePath = path.join(__dirname, '..', 'asr-python-421913-dd1251ecfb30.json');
      console.log('keyFilenamePath:', keyFilenamePath);
      const storage = new Storage({ keyFilename: keyFilenamePath });
      const bucket = storage.bucket('user_files_asr');

      StorageSingleton.instance = {
        storage,
        bucket
      };
    }
    return StorageSingleton.instance;
  }

  static getBucket() {
    return StorageSingleton.getInstance().bucket;
  }

  static getStorage() {
    return StorageSingleton.getInstance().storage;
  }
}

module.exports = StorageSingleton;
