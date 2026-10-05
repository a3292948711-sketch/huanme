import { ArrowLeftRight } from "lucide-react";

export function BrandLogo({ className = "size-14 rounded-[18px]", iconClassName = "size-8" }: { className?: string; iconClassName?: string }) {
  return (
    <span className={`inline-grid shrink-0 place-items-center bg-yellow text-ink ${className}`} aria-hidden="true">
      <ArrowLeftRight className={iconClassName} strokeWidth={3} />
    </span>
  );
}
