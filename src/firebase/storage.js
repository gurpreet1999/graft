import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from ".";

/**
 * Uploads a file to the storage.
 * @param {Object} params.file - File to upload.
 * @param {string} params.path - Path to upload the file to.
 * @param {Function} params.setProgress - Function to set the progress of the upload.
 * @returns {Promise} - Promise that resolves when the file path when it is uploaded.
 */
export const uploadFile = async ({ file, path, setProgress }) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        switch (snapshot.state) {
          case "running":
            if (setProgress) setProgress(progress);
            break;
          default:
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            reject(new Error("User is not authorized to upload file."));
            break;
          case "storage/canceled":
            // User canceled the upload
            reject(new Error("User canceled the upload."));
            break;
          default:
            reject(new Error(error.message));
            break;
        }
      },
      () => {
        resolve(path);
      }
    );
  });
};

/**
 * Gets the download URL of a file.
 * @param {string} path - Path to the file.
 * @returns {Promise<string>} - Promise that resolves with the download URL.
 */
export const getDownloadFileURL = async (path) => {
  const storageRef = ref(storage, path);
  const url = await getDownloadURL(storageRef);

  return url;
};

/**
 * Deletes a file from the storage.
 * @param {string} path - Path to the file.
 * @returns {Promise} - Promise that resolves when the file is deleted.
 */
export const deleteFile = async (path) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};
