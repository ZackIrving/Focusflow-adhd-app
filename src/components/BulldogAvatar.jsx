export default function BulldogAvatar({ isExcited }) {
  return (
    <div
      className={`relative h-28 w-28 transition ${
        isExcited ? 'rotate-3 scale-105' : ''
      }`}
    >
      <div className="absolute left-4 top-4 h-20 w-20 rounded-[2rem] bg-stone-300 shadow-md" />

      <div className="absolute left-1 top-8 h-10 w-8 rounded-full bg-stone-400" />
      <div className="absolute right-1 top-8 h-10 w-8 rounded-full bg-stone-400" />

      <div className="absolute left-8 top-11 h-3 w-3 rounded-full bg-slate-900" />
      <div className="absolute right-8 top-11 h-3 w-3 rounded-full bg-slate-900" />

      <div className="absolute left-1/2 top-14 h-8 w-12 -translate-x-1/2 rounded-2xl bg-white" />
      <div className="absolute left-1/2 top-16 h-4 w-5 -translate-x-1/2 rounded-full bg-slate-900" />

      <div className="absolute left-1/2 top-[78px] h-2 w-8 -translate-x-1/2 rounded-full bg-slate-500" />

      <div className="absolute left-7 top-7 h-4 w-5 rounded-full bg-stone-200 opacity-80" />
      <div className="absolute right-7 top-7 h-4 w-5 rounded-full bg-stone-200 opacity-80" />
    </div>
  )
}