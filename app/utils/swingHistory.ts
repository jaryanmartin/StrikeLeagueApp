// swingHistory.ts

export type SwingMetrics = {
  faceAngle: number | null;
  swingPath: number | null;
  attackAngle?: number | null;
  sideAngle?: number | null;
};

export type FeedbackGroup = 'Pull' | 'Push' | 'Slice' | 'Hook' | 'Ideal';

export type SwingFeedback = {
  group: FeedbackGroup;   // used for images + text
  message?: string;       // optional raw message from backend if you want
};

export type SwingEntry = SwingMetrics & {
  id: string;
  timestamp: Date;
  feedback: SwingFeedback | null;   // <- now an object, can be null
};

const sessions: Record<string, SwingEntry[]> = {};
const listeners: Record<string, Array<(swings: SwingEntry[]) => void>> = {};

function notifySession(sessionId: string) {
  const swings = sessions[sessionId] ?? [];
  (listeners[sessionId] ?? []).forEach((cb) => cb([...swings]));
}

function generateSessionId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function startSession(): Promise<string> {
  const sessionId = generateSessionId();

  if (!sessions[sessionId]) {
    sessions[sessionId] = [];
  }

  return sessionId;
}

export async function logSwing(
  sessionId: string,
  metrics: SwingMetrics,
  feedback: SwingFeedback | null   // <- accepts group + optional message
) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = [];
  }

  const entry: SwingEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date(),
    feedback,
    faceAngle: metrics.faceAngle ?? null,
    swingPath: metrics.swingPath ?? null,
    attackAngle: metrics.attackAngle ?? null,
    sideAngle: metrics.sideAngle ?? null,
  };

  sessions[sessionId].unshift(entry);
  notifySession(sessionId);
}

export function subscribeToSwings(
  sessionId: string,
  onUpdate: (swings: SwingEntry[]) => void
) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = [];
  }
  if (!listeners[sessionId]) {
    listeners[sessionId] = [];
  }

  listeners[sessionId].push(onUpdate);
  onUpdate([...sessions[sessionId]]);

  return () => {
    listeners[sessionId] = (listeners[sessionId] ?? []).filter(
      (cb) => cb !== onUpdate
    );
  };
}

export async function clearSession(sessionId: string) {
  sessions[sessionId] = [];
  notifySession(sessionId);
}
