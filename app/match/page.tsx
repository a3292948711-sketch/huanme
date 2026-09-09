import { MatchBuilder } from "@/components/match-builder";

export default async function MatchPage({
  searchParams,
}: {
  searchParams: Promise<{ target?: string }>;
}) {
  const params = await searchParams;
  return <MatchBuilder targetId={Number(params.target ?? 1)} />;
}
