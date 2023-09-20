import { Storage } from "@google-cloud/storage";
const credential = JSON.parse(
  Buffer.from(
    `${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
    "base64"
  ).toString()
);

export const storage = new Storage({
  credentials: credential,
  projectId: process.env.GC_PROJECT_ID,
});

export const bucket = storage.bucket(process.env.GCS_BUCKET as string);

export const createWriteStream = (filename: string, contentType?: string) => {
  const ref = bucket.file(filename);

  const stream = ref.createWriteStream({
    gzip: true,
    contentType: contentType,
  });

  return stream;
};

// Function to retrieve a file from Google Cloud Storage using the file URL
export const getFileFromStorage = async (fileUrl: string) => {
  const [bucketName, fileName] = fileUrl.split("/").slice(-2);
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  try {
    const [fileExists] = await file.exists();
    if (!fileExists) {
      throw new Error("File does not exist in the specified bucket");
    }
  } catch (error) {
    throw new Error(
      "Error retrieving file from Google Cloud Storage: " + error
    );
  }

  try {
    const [fileContent] = await file.download();
    return fileContent;
  } catch (error) {
    throw new Error(
      "Error retrieving file content from Google Cloud Storage: " + error
    );
  }
};
