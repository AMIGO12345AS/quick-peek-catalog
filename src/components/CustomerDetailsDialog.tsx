import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ message: "Please enter your name" })
    .max(80, { message: "Name must be under 80 characters" }),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, { message: "Enter a valid 6-digit pincode" }),
});

export type CustomerDetails = { name: string; pincode: string };

const STORAGE_KEY = "customer:details:v1";

const readStored = (): Partial<CustomerDetails> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return {
      name: typeof obj?.name === "string" ? obj.name : "",
      pincode: typeof obj?.pincode === "string" ? obj.pincode : "",
    };
  } catch {
    return {};
  }
};

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  ctaLabel?: string;
  onSubmit: (details: CustomerDetails) => void;
};

export const CustomerDetailsDialog = ({
  open,
  onClose,
  title = "Your details",
  description = "We'll include this in your WhatsApp message so we can serve you faster.",
  ctaLabel = "Continue on WhatsApp",
  onSubmit,
}: Props) => {
  const [name, setName] = useState("");
  const [pincode, setPincode] = useState("");
  const [errors, setErrors] = useState<{ name?: string; pincode?: string }>({});

  useEffect(() => {
    if (open) {
      const stored = readStored();
      setName(stored.name ?? "");
      setPincode(stored.pincode ?? "");
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ name, pincode });
    if (!result.success) {
      const fieldErrors: { name?: string; pincode?: string } = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as "name" | "pincode";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please complete your details");
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
    } catch {
      /* ignore */
    }
    onSubmit(result.data);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cust-details-title"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-background p-5 shadow-elevated sm:rounded-3xl"
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 id="cust-details-title" className="text-base font-extrabold text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="cd-name" className="text-xs font-semibold text-foreground">
              Full name
            </label>
            <input
              id="cd-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              maxLength={80}
              autoComplete="name"
              autoFocus
              placeholder="e.g. Aarav Sharma"
              aria-invalid={!!errors.name}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.name && (
              <p className="text-xs font-medium text-sale">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="cd-pin" className="text-xs font-semibold text-foreground">
              Delivery pincode
            </label>
            <input
              id="cd-pin"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pincode}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPincode(v);
                if (errors.pincode) setErrors((p) => ({ ...p, pincode: undefined }));
              }}
              maxLength={6}
              autoComplete="postal-code"
              placeholder="6-digit pincode"
              aria-invalid={!!errors.pincode}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium tabular-nums text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.pincode && (
              <p className="text-xs font-medium text-sale">{errors.pincode}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-bold text-background shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MessageCircle className="h-5 w-5" />
            {ctaLabel}
          </button>
        </form>
      </div>
    </div>
  );
};
