type DetailSkeletonBlockProps = {
  className: string;
};

export default function DetailSkeletonBlock({
  className,
}: DetailSkeletonBlockProps) {
  return <div className={`animate-pulse rounded-xl bg-white/6 ${className}`} />;
}
