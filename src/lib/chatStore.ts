import { useSyncExternalStore } from "react";
import { MOCK_CONVERSATIONS } from "./mockData";

export type Conversation = {
  id: string;
  title: string;
  preview: string;
  time: string;
  source: "dynatrace" | "salesforce" | "mixed";
  pinned: boolean;
  group: string;
};

let conversations: Conversation[] = MOCK_CONVERSATIONS.map(c => ({ ...c }));
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot() {
  return conversations;
}

export function useChatStore() {
  const convs = useSyncExternalStore(subscribe, getSnapshot);

  const deleteConversation = (id: string) => {
    conversations = conversations.filter(c => c.id !== id);
    notify();
  };

  const togglePin = (id: string) => {
    conversations = conversations.map(c =>
      c.id === id ? { ...c, pinned: !c.pinned } : c
    );
    notify();
  };

  const addConversation = (conv: Conversation) => {
    conversations = [conv, ...conversations];
    notify();
  };

  return { conversations: convs, deleteConversation, togglePin, addConversation };
}
