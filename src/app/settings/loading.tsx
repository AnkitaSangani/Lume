export default function SettingsLoading() {
  return (
    <div className="w-full flex flex-col gap-8 pb-10 animate-pulse">
      <header className="flex flex-col gap-2 pt-2">
        <div className="h-8 w-32 bg-gray-100 rounded-md"></div>
        <div className="h-4 w-28 bg-gray-100 rounded-md"></div>
      </header>
      
      <section className="flex flex-col items-center justify-center p-10 bg-surface rounded-3xl border border-gray-100 gap-4 mt-2">
        <div className="w-12 h-12 bg-gray-100 rounded-full mb-2"></div>
        <div className="h-4 w-48 bg-gray-100 rounded-md"></div>
        <div className="h-4 w-32 bg-gray-100 rounded-md"></div>
      </section>

      <section className="mt-8">
        <div className="w-full h-[66px] bg-red-50 rounded-full border border-red-100 shadow-sm opacity-50"></div>
      </section>
    </div>
  );
}
