const portraitPositions: Record<string, string> = {
  "换么体验官": "0% 0%",
  "阿泽的装备库": "100% 0%",
  "Neo玩家": "100% 0%",
  "Momo的掌机仓": "0% 100%",
  "银盐日记": "0% 100%",
  "玩具星球Leo": "100% 100%",
  "键圈小白": "100% 100%",
};
const interestAvatarPositions: Record<string, string> = {
  "Neo玩家": "0% 0%",
  "Momo的掌机仓": "100% 0%",
  "银盐日记": "0% 100%",
  "玩具星球Leo": "100% 100%",
};

export function UserAvatar({ name, className = "size-10" }: { name: string; className?: string }) {
  const interestPosition = interestAvatarPositions[name];
  return (
    <span
      role="img"
      aria-label={`${name}的头像`}
      className={`inline-block shrink-0 rounded-full bg-muted bg-no-repeat ring-2 ring-white/80 ${className}`}
      style={{
        backgroundImage: interestPosition ? "url('/avatars/interests-grid.png')" : "url('/avatars/users-grid.png')",
        backgroundSize: "200% 200%",
        backgroundPosition: interestPosition ?? portraitPositions[name] ?? "100% 100%",
      }}
    />
  );
}
