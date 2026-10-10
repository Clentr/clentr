import {
  AppWindow, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, BookOpen, Bot, BotMessageSquare, BrainCircuit,
  Calendar, Cctv, Check, CircleCheck, Clapperboard, Clock, Cloud, CodeXml, Coffee, Compass, Copy, FileText,
  Folder, FolderOpen, GitBranch, GitPullRequest, HardDrive, Heart, Laptop, Layers, Lock, Mail, Menu, MessageCircle,
  MessagesSquare, Mic, Minus, Monitor, MonitorSmartphone, Moon, Paperclip, PenTool, PhoneCall, Plane, Rocket,
  ScanEye, ScanText, Search, Send, Share2, ShieldCheck, Smartphone, Sparkles, SquareTerminal, Star, Sun, Ticket,
  Timer, TrendingUp, UserRound, Users, Workflow, X, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "app-window": AppWindow, "arrow-left": ArrowLeft, "arrow-right": ArrowRight, "arrow-up-right": ArrowUpRight,
  "audio-lines": AudioLines, "book-open": BookOpen, bot: Bot, "bot-message-square": BotMessageSquare,
  "brain-circuit": BrainCircuit, calendar: Calendar, cctv: Cctv, check: Check, "circle-check": CircleCheck,
  clapperboard: Clapperboard, clock: Clock, cloud: Cloud, "code-xml": CodeXml, coffee: Coffee, compass: Compass,
  copy: Copy, "file-text": FileText, folder: Folder, "folder-open": FolderOpen, "git-branch": GitBranch,
  "git-pull-request": GitPullRequest, "hard-drive": HardDrive, heart: Heart, laptop: Laptop, layers: Layers,
  lock: Lock, mail: Mail, menu: Menu, "message-circle": MessageCircle, "messages-square": MessagesSquare, mic: Mic,
  minus: Minus, monitor: Monitor, "monitor-smartphone": MonitorSmartphone, moon: Moon, paperclip: Paperclip,
  "pen-tool": PenTool, "phone-call": PhoneCall, plane: Plane, rocket: Rocket, "scan-eye": ScanEye,
  "scan-text": ScanText, search: Search, send: Send, share: Share2, "shield-check": ShieldCheck,
  smartphone: Smartphone, sparkles: Sparkles, "square-terminal": SquareTerminal, star: Star, sun: Sun,
  ticket: Ticket, timer: Timer, "trending-up": TrendingUp, user: UserRound, users: Users, workflow: Workflow, x: X,
};

export function Icon({ name, className, strokeWidth = 1.75 }: { name: string; className?: string; strokeWidth?: number }) {
  const C = ICONS[name] ?? Sparkles;
  return <C className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
