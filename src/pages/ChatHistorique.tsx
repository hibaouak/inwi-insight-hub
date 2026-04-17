import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Pin, Trash2, MessageSquare, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SourceBadge } from "@/components/dashboard/Badges";
import { useChatStore } from "@/lib/chatStore";

export default function ChatHistorique() {
  const navigate = useNavigate();
  const { conversations, deleteConversation, togglePin } = useChatStore();
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = conversations.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.preview.toLowerCase().includes(search.toLowerCase())
  );

  const groups = filtered.reduce<Record<string, typeof conversations>>((acc, c) => {
    const key = c.pinned ? "Épinglées" : c.group;
    (acc[key] ||= []).push(c);
    return acc;
  }, {});

  const groupOrder = ["Épinglées", "Today", "Yesterday", "Last 7 days", "Last 30 days"];
  const sortedGroups = Object.entries(groups).sort(([a], [b]) => {
    const ai = groupOrder.indexOf(a);
    const bi = groupOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      deleteConversation(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Historique des conversations</h1>
        <p className="text-sm text-muted-foreground mt-1">{conversations.length} conversations enregistrées</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une conversation…"
          className="pl-10 bg-surface/60 border-border/60 focus-visible:ring-primary/50"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucune conversation trouvée</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedGroups.map(([group, convs]) => (
            <div key={group}>
              <div className="flex items-center gap-2 mb-3">
                {group === "Épinglées" && <Pin className="h-3.5 w-3.5 text-primary" />}
                <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">{group}</span>
                <div className="flex-1 h-px bg-border/40" />
              </div>
              <div className="space-y-2">
                {convs.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass rounded-xl p-4 flex items-center gap-4 group hover:bg-surface/60 transition-all"
                  >
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate("/app/chat", { state: { conversationId: c.id } })}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {c.pinned && <Pin className="h-3 w-3 text-primary shrink-0" />}
                        <span className="text-sm font-medium truncate">{c.title}</span>
                        <SourceBadge source={c.source} />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.preview}</p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                      <Clock className="h-3 w-3" />
                      <span>{c.time}</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn("h-7 w-7", c.pinned ? "text-primary" : "text-muted-foreground hover:text-primary")}
                        onClick={() => togglePin(c.id)}
                        title={c.pinned ? "Désépingler" : "Épingler"}
                      >
                        <Pin className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn("h-7 w-7", confirmDelete === c.id ? "text-danger bg-danger/10" : "text-muted-foreground hover:text-danger")}
                        onClick={() => handleDelete(c.id)}
                        title={confirmDelete === c.id ? "Cliquer à nouveau pour confirmer" : "Supprimer"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
