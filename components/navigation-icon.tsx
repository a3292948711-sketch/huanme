type NavigationIconProps = {
  label: string;
  className?: string;
};

/** Yellow navigation artwork shared by the home and inner-page navigation. */
export function NavigationIcon({ label, className = "size-9" }: NavigationIconProps) {
  const yellow = "#f5cc19";
  const pale = "#fff0a5";
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true" focusable="false">
      {label === "首页" && (
        <>
          <path d="M8 29 27 12a8 8 0 0 1 10 0l19 17c4 4 2 9-3 9v15a8 8 0 0 1-8 8H19a8 8 0 0 1-8-8V38c-5 0-7-5-3-9Z" fill="white" stroke={yellow} strokeWidth="2.5" />
          <path d="m15 31 17-15 17 15v21a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4Z" fill={pale} />
          <path d="M25 56V43a7 7 0 0 1 14 0v13" fill={yellow} />
          <path d="m51 10 2-5m3 12 4-3" stroke={yellow} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {label === "换圈" && (
        <>
          <circle cx="32" cy="31" r="23" fill={pale} />
          <circle cx="24" cy="33" r="6" fill={yellow} />
          <circle cx="24" cy="33" r="9" stroke={yellow} strokeOpacity=".45" />
          <circle cx="39" cy="19" r="4.5" fill={yellow} />
          <circle cx="39" cy="19" r="6.5" stroke={yellow} />
          <path d="M12 40C-5 59 9 62 34 48S69 15 55 14" stroke={yellow} strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}
      {label === "发布" && (
        <>
          <path d="M33 5a27 27 0 0 1 23 41l-7 9M29 59A27 27 0 0 1 14 9" stroke={yellow} strokeWidth="2.5" strokeLinecap="round" />
          <path d="m8 8 9-1 1 10m29 33 1 10 10-1" stroke={yellow} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m14 23 34-5c5-1 6 2 4 7L40 49c-2 4-5 4-8 1l-8-9-6 2-1-9-6-6c-2-2-1-4 3-5Z" fill={pale} stroke={yellow} strokeWidth="1.5" />
          <path d="m23 28 22-5-14 14m-8-9 1 11" stroke={yellow} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {label === "消息" && (
        <>
          <rect x="39" y="7" width="23" height="19" rx="7" fill={pale} />
          <path d="m45 15 1 2m5-2 1 2m5-2 1 2" stroke={yellow} strokeWidth="2" strokeLinecap="round" />
          <path d="M24 14C10 15 6 28 6 39L3 48c-2 7 2 10 8 8l9-3 23 1c7 0 10-5 6-11l-4-7c-1-11-8-23-21-22Z" fill="white" stroke={yellow} strokeWidth="1.5" />
          <path d="M25 18C14 19 10 30 10 40l-3 9c-1 3 1 5 5 4l9-3 21 1c4 0 5-3 3-6l-4-8c-1-10-7-20-16-19Z" fill={pale} />
          <circle cx="25" cy="14" r="7" fill="white" stroke={yellow} />
          <circle cx="25" cy="14" r="4" fill={pale} />
          <circle cx="35" cy="40" r="3.5" fill={yellow} fillOpacity=".5" />
          <path d="M20 55c4 10 14 10 18 0" stroke={yellow} strokeWidth="1.5" />
        </>
      )}
      {label === "我的" && (
        <>
          <circle cx="31" cy="17" r="13" fill={pale} stroke={yellow} strokeWidth="2.5" />
          <circle cx="31" cy="17" r="6" fill={yellow} />
          <path d="M31 39H19A15 15 0 0 0 4 54v7h27" fill={pale} stroke={yellow} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 45h-7a7 7 0 0 0-7 7v3h14" stroke={yellow} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M38 46h22l-6-6m6 6H38m22 9H38l6 6" stroke={yellow} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}
