export default function ProfileLoading() {
  return (
    <div className="w-full flex flex-col gap-8 pb-10 animate-pulse">
      <header className="flex flex-col gap-2 pt-2">
        <div className="h-8 w-32 bg-gray-100 rounded-md"></div>
        <div className="h-4 w-24 bg-gray-100 rounded-md"></div>
      </header>

      <section className="bg-surface rounded-3xl p-6 flex items-center justify-between border border-gray-100 shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-gray-100"></div>
          <div className="flex flex-col gap-2">
             <div className="h-5 w-32 bg-gray-100 rounded-md"></div>
             <div className="h-3 w-16 bg-gray-100 rounded-md"></div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="h-4 w-32 bg-gray-100 rounded-md"></div>
        <div className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
             <div className="h-4 w-16 bg-gray-100 rounded-md"></div>
             <div className="h-5 w-20 bg-gray-100 rounded-md"></div>
          </div>
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
             <div className="h-4 w-32 bg-gray-100 rounded-md"></div>
             <div className="h-5 w-20 bg-gray-100 rounded-md"></div>
          </div>
          <div className="flex justify-between items-center p-4">
             <div className="h-4 w-24 bg-gray-100 rounded-md"></div>
             <div className="h-5 w-20 bg-gray-100 rounded-md"></div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 mt-2">
        <div className="h-4 w-32 bg-gray-100 rounded-md"></div>
        <div className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
             <div className="h-4 w-24 bg-gray-100 rounded-md"></div>
             <div className="h-5 w-20 bg-gray-100 rounded-md"></div>
          </div>
          <div className="flex justify-between items-center p-4">
             <div className="h-4 w-24 bg-gray-100 rounded-md"></div>
             <div className="h-5 w-20 bg-gray-100 rounded-md"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
