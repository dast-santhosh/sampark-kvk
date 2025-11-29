import { db } from "../firebase";
import { collection, doc, getDoc, getDocs, setDoc, query, where, addDoc, updateDoc } from "firebase/firestore";
import { MOCK_HOMEWORK, MOCK_MARKS, MOCK_NOTICES, MOCK_STUDENTS } from "../constants";
import { User, Role, Student, Notice, Homework } from "../types";

// Collections
const USERS_COL = "users";
const STUDENTS_COL = "students";
const NOTICES_COL = "notices";
const HOMEWORK_COL = "homework";
const MARKS_COL = "marks";

export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const docRef = doc(db, USERS_COL, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const getStudentsByClass = async (className: string): Promise<Student[]> => {
  try {
    // In a real app with many students, you'd index 'class'
    const q = query(collection(db, STUDENTS_COL), where("class", "==", className));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

export const getAllStudents = async (): Promise<Student[]> => {
    try {
        const snapshot = await getDocs(collection(db, STUDENTS_COL));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    } catch (error) {
        console.error("Error fetching all students", error);
        return [];
    }
}

export const getNotices = async (): Promise<Notice[]> => {
  try {
    const snapshot = await getDocs(collection(db, NOTICES_COL));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notice));
  } catch (error) {
    console.error("Error fetching notices:", error);
    return [];
  }
};

export const getHomework = async (className?: string): Promise<Homework[]> => {
  try {
    let q;
    if (className) {
      q = query(collection(db, HOMEWORK_COL), where("class", "==", className));
    } else {
      q = collection(db, HOMEWORK_COL); // For admin or all view
    }
    // Handle case where q is query or collection reference
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Homework));
  } catch (error) {
    console.error("Error fetching homework:", error);
    return [];
  }
};

// Seed Function to populate DB for the first time
export const seedDatabase = async () => {
    console.log("Seeding database...");
    
    // Seed Students
    for (const s of MOCK_STUDENTS) {
        await setDoc(doc(db, STUDENTS_COL, s.id), s);
    }

    // Seed Notices
    for (const n of MOCK_NOTICES) {
        await setDoc(doc(db, NOTICES_COL, n.id), n);
    }

    // Seed Homework
    for (const h of MOCK_HOMEWORK) {
        await setDoc(doc(db, HOMEWORK_COL, h.id), h);
    }

    // Seed Marks (Flattening mock structure slightly for DB)
    for (const m of MOCK_MARKS) {
        await addDoc(collection(db, MARKS_COL), { ...m, studentId: 'S101' }); // Assigning to first student for demo
    }

    // Create a default Admin User if not exists (This is just a metadata record, Auth user must be created in Firebase Console or Signup)
    // Note: In production, you don't store passwords here. This maps Auth UID to Role.
    // For this demo, we assume the user logged in and we create a profile on the fly if needed in App.tsx, 
    // but here is a sample structure.
    console.log("Seeding complete.");
};