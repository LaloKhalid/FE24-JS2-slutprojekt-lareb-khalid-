import { initializeApp } from 'firebase/app';
import type { DocumentData } from 'firebase/firestore';

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  QueryDocumentSnapshot,
} from "firebase/firestore";

 // Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAU1RpKD3mzYpNAUl4No9MAmytLWVpODuc",
  authDomain: "scrumboard-fe24.firebaseapp.com",
  projectId: "scrumboard-fe24",
  storageBucket: "scrumboard-fe24.appspot.com",
  messagingSenderId: "194278134561",
  appId: "1:194278134561:web:09f4a87077e71c1636e460",
  measurementId: "G-JN5840LZYZ"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ---------------------------
// CRUD for Members
// ---------------------------
export const addMember = async (name: string, role: string) => {
  return await addDoc(collection(db, "members"), { name, role });
};

export const getMembers = async () => {
  const snapshot = await getDocs(collection(db, "members"));
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ---------------------------
// CRUD for Tasks
// ---------------------------
export const addTask = async (
  title: string,
  description: string,
  category: string
) => {
  return await addDoc(collection(db, "tasks"), {
    title,
    description,
    category,
    status: "new",
    assigned: null,
    timestamp: new Date(),
  });
};

export const getTasks = async () => {
  const snapshot = await getDocs(collection(db, "tasks"));
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateTask = async (taskId: string, updates: object) => {
  const taskRef = doc(db, "tasks", taskId);
  return await updateDoc(taskRef, updates);
};

export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, "tasks", taskId);
  return await deleteDoc(taskRef);
};
