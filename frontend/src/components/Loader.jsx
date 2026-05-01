export default function Loader({ fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold tracking-widest text-[10px] animate-pulse uppercase">Loading...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
        {content}
      </div>
    );
  }

  return content;
}
