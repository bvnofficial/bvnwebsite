"use client";

import { useState } from "react";
import { Twitter, Facebook, Linkedin, MessageCircle, Link as LinkIcon, Check } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  compact?: boolean;
}

export default function ShareButtons({ url, title, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "X / Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      color: "hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-400/10",
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      color: "hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/10",
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      color: "hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/10",
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
      color: "hover:text-green-400 hover:border-green-400/30 hover:bg-green-400/10",
    },
  ];

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {links.map(({ label, icon: Icon, href, color }) => (
          <button
            key={label}
            type="button"
            title={`Share on ${label}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(href, "_blank", "noopener,noreferrer"); }}
            className={`w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-white/40 transition-all duration-200 ${color}`}
          >
            <Icon size={12} />
          </button>
        ))}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyLink(); }}
          title="Copy link"
          className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-orange hover:border-orange/30 hover:bg-orange/10 transition-all duration-200"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <LinkIcon size={12} />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-white/40 text-xs font-accent font-semibold mr-1">Share:</span>
      {links.map(({ label, icon: Icon, href, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${label}`}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/50 text-xs font-accent font-semibold transition-all duration-200 ${color}`}
        >
          <Icon size={13} />
          {label}
        </a>
      ))}
      <button
        onClick={copyLink}
        title="Copy link"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/50 text-xs font-accent font-semibold hover:text-orange hover:border-orange/30 hover:bg-orange/10 transition-all duration-200"
      >
        {copied ? <Check size={13} className="text-green-400" /> : <LinkIcon size={13} />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
