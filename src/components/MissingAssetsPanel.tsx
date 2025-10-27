import { AnimatePresence, motion } from 'framer-motion';
import { Copy, ImageIcon } from 'lucide-react';
import { useState } from 'react';

import { useImageSlotRegistry } from '@components/providers/ImageSlotRegistry';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';

function copyPrompt(text: string | undefined) {
  if (!text || !navigator?.clipboard) return;
  void navigator.clipboard.writeText(text);
}

type MissingAssetsPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function MissingAssetsPanel({ open, onClose }: MissingAssetsPanelProps) {
  const { missing } = useImageSlotRegistry();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, value?: string) => {
    if (!value) return;
    copyPrompt(value);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-x-0 top-20 z-40 mx-auto w-[min(720px,90%)] rounded-3xl border border-border/40 bg-background/95 p-6 shadow-2xl backdrop-blur-xl"
          role="dialog"
          aria-labelledby="missing-assets-heading"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-4">
            <div>
              <h2 id="missing-assets-heading" className="text-lg font-semibold text-foreground">
                Missing assets
              </h2>
              <p className="text-sm text-muted-foreground">
                {missing.length
                  ? 'Generate images with the prompts below.'
                  : 'All image slots are wired. Replace the placeholders when assets are ready.'}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close missing assets panel">
              <span className="text-xl">×</span>
            </Button>
          </div>

          <div className="mt-4 max-h-[320px] space-y-4 overflow-y-auto pr-2">
            {missing.length === 0 ? (
              <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                Everything looks good. Replace the default placeholders whenever assets are available.
              </div>
            ) : (
              missing.map(({ definition, status }) => {
                const pathValue = definition.files.webp ?? definition.files.svg ?? definition.files.fallback ?? '';
                return (
                  <div key={definition.id} className="rounded-2xl border border-border/50 bg-card/70 p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="uppercase tracking-wide">
                          {definition.id}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">{definition.label}</span>
                      </div>
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">{status}</span>
                    </div>
                    <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate font-medium text-foreground">{pathValue || 'Placeholder path not configured'}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(`${definition.id}-path`, pathValue)}
                          disabled={!pathValue}
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-3.5 w-3.5" /> Path
                        </Button>
                      </div>
                      {definition.prompt ? (
                        <div className="rounded-2xl border border-border/40 bg-background/80 p-3 text-left text-xs leading-relaxed text-muted-foreground">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="font-semibold text-foreground/80">Prompt</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(definition.id, definition.prompt)}
                              className="flex items-center gap-2"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              {copiedId === definition.id ? 'Copied' : 'Copy'}
                            </Button>
                          </div>
                          <p className="text-balance text-muted-foreground/90">{definition.prompt}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

export function MissingAssetsToggle() {
  const { missing } = useImageSlotRegistry();
  const [open, setOpen] = useState(false);

  const label = missing.length ? `${missing.length} assets pending` : 'All assets ready';

  return (
    <div className="relative">
      <Button variant={missing.length ? 'outline' : 'ghost'} size="sm" onClick={() => setOpen((prev) => !prev)}>
        <ImageIcon className="h-4 w-4" />
        <span>{label}</span>
      </Button>
      <MissingAssetsPanel open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
