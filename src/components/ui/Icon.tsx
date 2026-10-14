import {
  AppWindow, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, BookOpen, Bot, BotMessageSquare, BrainCircuit,
  Calendar, Cctv, Check, CircleCheck, Clapperboard, Clock, Cloud, CodeXml, Coffee, Compass, Copy, FileText,
  Folder, FolderOpen, GitBranch, GitPullRequest, HardDrive, Heart, Laptop, Layers, Lock, Mail, Menu, MessageCircle,
  MessagesSquare, Mic, Minus, Monitor, MonitorSmartphone, Moon, Paperclip, PenTool, PhoneCall, Plane, Rocket,
  ScanEye, ScanText, Search, Send, Share2, ShieldCheck, Smartphone, Sparkles, SquareTerminal, Star, Sun, Ticket,
  Timer, TrendingUp, UserRound, Users, Workflow, X, TriangleAlert, Package, Quote, BadgeCheck, Zap, CalendarCheck, Hourglass, Puzzle, Repeat, Store, Infinity as InfinityIcon, Plus, Download, Maximize2, Minimize2, Link2, ExternalLink, type LucideIcon,
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
  "triangle-alert": TriangleAlert, package: Package, quote: Quote, "badge-check": BadgeCheck, zap: Zap,
  "calendar-check": CalendarCheck, hourglass: Hourglass, puzzle: Puzzle, repeat: Repeat, store: Store, infinity: InfinityIcon,
  plus: Plus, download: Download, maximize: Maximize2, minimize: Minimize2, link: Link2, "external-link": ExternalLink,
};

/** Names an admin can choose from. */
export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, className, strokeWidth = 1.75 }: { name: string; className?: string; strokeWidth?: number }) {
  const C = ICONS[name] ?? Sparkles;
  return <C className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
