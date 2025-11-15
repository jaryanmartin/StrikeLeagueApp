// app/utils/swingHistory.ts
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

export type SwingMetrics = {
  faceAngle: number | null;
  swingPath: number | null;
  attackAngle?: number | null;
  sideAngle?: number | null;
  // add whatever you already have
};

export type SwingEntry = SwingMetrics & {
  id: string;
  timestamp: Date;
  feedback: string; // or an object if you want
};

// ---- session helpers ----

export async function startSession(): Promise<string> {
  const sessionRef = await addDoc(collection(db, "sessions"), {
    startedAt: serverTimestamp(),
  });
  return sessionRef.id;
}

export async function logSwing(
  sessionId: string,
  metrics: SwingMetrics,
  feedback: string
) {
  const swingsCol = collection(db, "sessions", sessionId, "swings");
  await addDoc(swingsCol, {
    ...metrics,
    feedback,
    timestamp: serverTimestamp(),
  });
}

// subscribe to swings for Analytics tab
export function subscribeToSwings(
  sessionId: string,
  onUpdate: (swings: SwingEntry[]) => void
) {
  const swingsCol = collection(db, "sessions", sessionId, "swings");
  const q = query(swingsCol, orderBy("timestamp", "desc")); // newest first

  return onSnapshot(q, (snap) => {
    const data: SwingEntry[] = snap.docs.map((d) => {
      const raw = d.data() as any;
      return {
        id: d.id,
        feedback: raw.feedback ?? "",
        faceAngle: raw.faceAngle ?? null,
        swingPath: raw.swingPath ?? null,
        attackAngle: raw.attackAngle ?? null,
        sideAngle: raw.sideAngle ?? null,
        timestamp: raw.timestamp?.toDate
          ? raw.timestamp.toDate()
          : new Date(),
      };
    });
    onUpdate(data);
  });
}

// delete all swings for a session (call when session ends)
export async function clearSession(sessionId: string) {
  const swingsCol = collection(db, "sessions", sessionId, "swings");
  const snap = await getDocs(swingsCol);
  await Promise.all(
    snap.docs.map((d) =>
      deleteDoc(doc(db, "sessions", sessionId, "swings", d.id))
    )
  );
}
