import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase.config.js";

async function uploadImage(file, quantity) {
    const storageFB = getStorage();

    await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH)

    if (quantity === 'single') {
        const dateTime = Date.now();
        const fileName = `images/${dateTime}`
        const storageRef = ref(storageFB, fileName)
        const metadata = {
            contentType: file.type,
        }
        await uploadBytesResumable(storageRef, file.buffer, metadata);
        return fileName
    }

    if (quantity === 'multiple') {
        for (let i = 0; i < file.images.length; i++) {
            const dateTime = Date.now();
            const fileName = `images/${dateTime}`
            const storageRef = ref(storageFB, fileName)
            const metadata = {
                contentType: file.images[i].mimetype,
            }

            const saveImage = await Image.create({ imageUrl: fileName });
            file.item.imageId.push({ _id: saveImage._id });
            await file.item.save();

            await uploadBytesResumable(storageRef, file.images[i].buffer, metadata);

        }
        return
    }

}

export const uploadFile = async (req, res) => {
    const storageFB = getStorage();
    const file = {
        type: req.file.mimetype,
        buffer: req.file.buffer,
    };
    const dateTime = Date.now();
    const fileName = `images/${dateTime}`
    const storageRef = ref(storageFB, fileName)
    const metadata = {
        contentType: file.type,
    }
    await uploadBytesResumable(storageRef, file.buffer, metadata);
    try {
        const buildImage = await uploadImage(file, 'single');
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        res.send({
            status: "SUCCESS",
            imageName: buildImage,
            downloadURL: downloadURL
        })
    } catch (err) {
        console.log(err);
    }
};


