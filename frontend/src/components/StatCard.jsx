export default function StatCard({ icon: Icon, label, value, suffix }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>
      
      <div className="relative z-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-extrabold mt-1 text-gray-800">
          {value}
          {suffix && <span className="text-sm font-medium text-gray-400 ml-1">{suffix}</span>}
        </p>
      </div>
      
      <div className="relative z-10 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl text-primary shadow-inner transition-transform group-hover:-rotate-12">
        <Icon size={24} strokeWidth={2.5} />
      </div>
    </div>
  );
}
