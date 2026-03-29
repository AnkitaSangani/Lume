import { Activity } from "lucide-react";

export default function TrendsPage() {
  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <header className="flex flex-col gap-1 pt-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">True Trends</h1>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Historical Analytics</p>
      </header>
      
      <section className="flex flex-col items-center justify-center p-10 bg-surface rounded-3xl border border-gray-100">
        <Activity size={48} className="text-primary mb-4 animate-pulse opacity-50" />
        <p className="text-center font-bold text-gray-400 max-w-[200px]">Gathering 30 days of metrics exactly. Check back shortly.</p>
      </section>
    </div>
  );
}
