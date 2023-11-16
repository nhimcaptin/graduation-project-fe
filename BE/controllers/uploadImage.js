import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { auth } from "../config/firebase.config.js";

async function uploadImage(file, quantity) {
  const storageFB = getStorage();

  if (quantity === "single") {
    const dateTime = Date.now();
    const fileName = `images/${dateTime}`;
    const storageRef = ref(storageFB, fileName);
    const metadata = {
      contentType: file.type,
    };
    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
    return { snapshot, fileName };
  }

  if (quantity === "multiple") {
    for (let i = 0; i < file.images.length; i++) {
      const dateTime = Date.now();
      const fileName = `images/${dateTime}`;
      const storageRef = ref(storageFB, fileName);
      const metadata = {
        contentType: file.images[i].mimetype,
      };

      const saveImage = await Image.create({ imageUrl: fileName });
      file.item.imageId.push({ _id: saveImage._id });
      await file.item.save();

      await uploadBytesResumable(storageRef, file.images[i].buffer, metadata);
    }
    return;
  }
}

export const uploadFile = async (req, res) => {
  try {
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
    const { snapshot, fileName } = await uploadImage(file, "single");
    const downloadURL = await getDownloadURL(snapshot.ref);
    res.send({
      status: "SUCCESS",
      imageName: fileName,
      downloadURL: downloadURL,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server." });
  }
};
