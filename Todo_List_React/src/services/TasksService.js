import { doc, getDocs, collection, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";


export const getTasks = async () => {
    const tasksCollection = await getDocs(collection(db, 'tasks'))
    const data = tasksCollection.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return data;
}

export const addTask = async (newTask) => {
    const response = await addDoc(collection(db, 'tasks'), newTask);
    return response;
}

export const updateTask = async (task) => {
    const docRef = doc(db, 'tasks', task.id);
    await updateDoc(docRef, task);
}

export const deleteTask = async (id) => {
    const docRef = doc(db, 'tasks', id);
    await deleteDoc(docRef);
}