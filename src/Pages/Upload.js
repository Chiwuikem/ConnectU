import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const storage = getStorage();

export async function uploadProviderImage(file) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const imageRef = ref(storage, `gs://serviceswitch-9a265.firebasestorage.app/provider_images/${user.uid}/images/${file.name}`);
  await uploadBytes(imageRef, file);
  const imageUrl = await getDownloadURL(imageRef);

  return imageUrl;
}
