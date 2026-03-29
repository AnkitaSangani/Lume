export default function TrendsLoading() {
  return (
    <div className="w-full flex flex-col gap-8 pb-10 animate-pulse">
      <header className="flex flex-col gap-2 pt-2">
        <div className="h-8 w-40 bg-gray-100 rounded-md"></div>
        <div className="h-4 w-32 bg-gray-100 rounded-md"></div>
      </header>
      
      <section className="bg-surface rounded-3xl p-6 border border-gray-100 shadow-sm min-h-[350px]">
        <div className="h-4 w-40 bg-gray-100 rounded-md mb-6"></div>
        <div className="w-full h-[250px] bg-gray-50 rounded-2xl border border-gray-100 flex items-end px-4 gap-2 pb-4">
           {/* Faux graph columns mimicking Recharts interpolation */}
           <div className="flex-1 bg-gray-100 h-[30%] rounded-t-md"></div>
           <div className="flex-1 bg-gray-100 h-[45%] rounded-t-md"></div>
           <div className="flex-1 bg-gray-100 h-[35%] rounded-t-md"></div>
           <div className="flex-1 bg-gray-100 h-[60%] rounded-t-md"></div>
           <div className="flex-1 bg-gray-100 h-[50%] rounded-t-md"></div>
           <div className="flex-1 bg-gray-100 h-[80%] rounded-t-md opacity-80"></div>
           <div className="flex-1 bg-gray-100 h-[70%] rounded-t-md opacity-60"></div>
        </div>
      </section>
    </div>
  );
}
