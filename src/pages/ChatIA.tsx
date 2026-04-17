import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Plus, Search, Pin, MoreHorizontal, Send, Sparkles, Copy, ThumbsUp, ThumbsDown, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { MOCK_CONVERSATIONS, SUGGESTED_PROMPTS } from "@/lib/mockData";
import { SourceBadge } from "@/components/dashboard/Badges";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: "dynatrace" | "salesforce" | "mixed";
  confidence?: number;
  streaming?: boolean;
}

const MOCK_REPLY = `## Root cause: VoLTE IMS core saturation

I correlated **3 Dynatrace alerts** with **47 Salesforce tickets** opened in Casablanca over the last 90 minutes.

**Timeline:**
- \`14:02\` — Latency on IMS-CSCF spikes from 18ms → 320ms
- \`14:08\` — First customer ticket opened ("calls dropping")
- \`14:14\` — VoLTE registration failures cross 12% threshold

**Likely cause:** A scheduled config push on the IMS-CSCF cluster at 14:01 introduced an mTLS handshake regression. This is consistent with a known issue (KB-4421).

**Recommended actions:**
1. Roll back config push on \`ims-cscf-prod-01..04\`
2. Notify ~3,200 affected subscribers via SMS apology
3. Open post-mortem ticket linked to INC-48217

> 📊 **Confidence: 92%** — based on 3 cross-source signals and historical pattern match.`;

export default function ChatIA() {
  const [activeId, setActiveId] = useState<string>("c1");
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "user",
      content: "What's causing the spike in VoLTE complaints from Casablanca right now?",
    },
    {
      id: "m2",
      role: "assistant",
      content: MOCK_REPLY,
      source: "mixed",
      confidence: 92,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const filtered = MOCK_CONVERSATIONS.filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()));
  const groups = filtered.reduce<Record<string, typeof MOCK_CONVERSATIONS>>((acc, c) => {
    const key = c.pinned ? "📌 Pinned" : c.group;
    (acc[key] ||= []).push(c);
    return acc;
  }, {});

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: t };
    const aiMsg: Message = { id: `a-${Date.now()}`, role: "assistant", content: "", streaming: true, source: "mixed", confidence: 88 };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput("");

    // Simulate streaming
    const fullReply = `Analyzing your query against live Dynatrace metrics and Salesforce tickets…\n\n${MOCK_REPLY.replace("VoLTE IMS core saturation", "investigation in progress")}`;
    let i = 0;
    const tick = () => {
      i += Math.max(1, Math.round(fullReply.length / 200));
      setMessages(prev =>
        prev.map(m =>
          m.id === aiMsg.id
            ? { ...m, content: fullReply.slice(0, i), streaming: i < fullReply.length }
            : m
        )
      );
      if (i < fullReply.length) setTimeout(tick, 28);
    };
    setTimeout(tick, 350);
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Conversations sidebar */}
      <aside className="w-72 shrink-0 border-r border-border/60 flex flex-col bg-sidebar/40">
        <div className="p-3 border-b border-border/60">
          <Button className="w-full bg-gradient-primary hover:opacity-90 shadow-glow-soft justify-start gap-2">
            <Plus className="h-4 w-4" /> New conversation
          </Button>
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="pl-8 h-8 bg-surface/60 text-xs" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {Object.entries(groups).map(([group, convs]) => (
            <div key={group}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 px-2 mb-1">{group}</div>
              <div className="space-y-0.5">
                {convs.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={cn(
                      "w-full text-left px-2.5 py-2 rounded-lg group relative transition-all",
                      activeId === c.id ? "bg-primary/10" : "hover:bg-surface/60"
                    )}
                  >
                    {activeId === c.id && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-primary shadow-glow-soft" />}
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium truncate flex-1">{c.title}</span>
                      <span className="text-[9px] text-muted-foreground shrink-0">{c.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-muted-foreground truncate">{c.preview}</span>
                      <SourceBadge source={c.source} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 shrink-0 border-b border-border/60 flex items-center px-5 gap-3">
          <div className="flex-1">
            <div className="text-sm font-semibold truncate">4G outage Casablanca — root cause</div>
            <div className="text-[10px] text-muted-foreground">2 messages · started 12 min ago</div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Pin className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
            {messages.map((m, idx) => (
              <MessageBubble key={m.id} message={m} index={idx} />
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border/60 p-4">
          <div className="max-w-3xl mx-auto">
            {messages.length <= 2 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {SUGGESTED_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-left text-xs glass rounded-xl p-3 glow-hover text-muted-foreground hover:text-foreground"
                  >
                    <Sparkles className="inline h-3 w-3 text-primary mr-1.5" />
                    {p}
                  </button>
                ))}
              </div>
            )}
            <div className="glass-strong rounded-2xl p-2 flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask about incidents, complaints, or correlations… (Ctrl+Enter to send)"
                rows={1}
                className="flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 text-sm min-h-[40px] max-h-32"
              />
              <Button
                onClick={() => send(input)}
                disabled={!input.trim()}
                size="icon"
                className="h-9 w-9 shrink-0 bg-gradient-primary hover:opacity-90 disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-muted-foreground">
              <span>inwi·IA can make mistakes. Always verify critical actions.</span>
              <span className="tabular-nums">{input.length} chars</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, index }: { message: Message; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
    >
      {message.role === "assistant" && (
        <div className="shrink-0">
          <Logo showText={false} />
        </div>
      )}
      <div className={cn("max-w-[85%]", message.role === "user" && "order-2")}>
        {message.role === "user" ? (
          <div className="bg-accent text-accent-foreground rounded-2xl rounded-tr-md px-4 py-2.5">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        ) : (
          <div>
            <div className="glass rounded-2xl rounded-tl-md px-5 py-4">
              {message.content ? (
                <div className="prose prose-sm prose-invert max-w-none
                  prose-headings:font-semibold prose-headings:text-foreground prose-headings:mt-4 prose-headings:mb-2 first:prose-headings:mt-0
                  prose-h2:text-base prose-h2:text-primary
                  prose-p:text-sm prose-p:text-foreground/90 prose-p:leading-relaxed
                  prose-strong:text-foreground
                  prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
                  prose-ol:text-sm prose-ul:text-sm prose-li:text-foreground/90 prose-li:my-0.5
                  prose-blockquote:border-l-primary prose-blockquote:text-foreground/80 prose-blockquote:not-italic
                ">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                  {message.streaming && <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 align-middle rounded-sm" />}
                </div>
              ) : (
                <TypingDots />
              )}
            </div>

            {!message.streaming && message.content && (
              <div className="flex items-center gap-2 mt-2 px-1">
                {message.source && <SourceBadge source={message.source} />}
                {typeof message.confidence === "number" && (
                  <span className="text-[10px] text-muted-foreground">Confidence: <span className="text-success font-semibold">{message.confidence}%</span></span>
                )}
                <div className="ml-auto flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-success"><ThumbsUp className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-danger"><ThumbsDown className="h-3 w-3" /></Button>
                  <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-[11px] text-primary hover:text-primary hover:bg-primary/10">
                    <FileText className="h-3 w-3" /> Create ticket
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 0.15, 0.3].map((d, i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce-dot"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </div>
  );
}
