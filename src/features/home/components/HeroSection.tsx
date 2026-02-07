import Link from "next/link";

export const HeroSection = () => (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-900 text-white p-10 md:p-16 rounded-[3.5rem] relative overflow-hidden shadow-2xl border border-slate-700">
            <div className="relative z-10">
                <span className="text-emerald-400 font-bold tracking-[0.2em] text-xs uppercase mb-6 block">
                    Planificación Urbana 
                </span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                    Ciudades <span className="text-slate-400">&</span> <span className="text-emerald-500">Naturaleza</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-lg mb-10 leading-relaxed">
                    Gestiona el crecimiento de las <span className="text-white font-semibold">grandes ciudades</span> sin perder de vista el pulmón de nuestros <span className="text-emerald-400">bosques</span>.
                </p>
                <Link href="/Pages/Mapa" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-emerald-900/40">
                    Explorar Mapa Global
                </Link>
            </div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>

    <div className="lg:col-span-4 bg-gradient-to-b from-sky-600 to-blue-800 rounded-[3.5rem] p-10 text-white flex flex-col justify-between shadow-xl group">
        <div className="space-y-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <span className="text-2xl">🌊</span>
            </div>
            <h3 className="text-2xl font-bold italic leading-tight">El mar dicta el ritmo de las costas modernas.</h3>
        </div>
        <Link href="/Pages/Reporte" className="flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/30 p-5 rounded-2xl transition-all">
            <span className="font-bold">Análisis Marítimo</span>
            <span className="text-xl">→</span>
        </Link>
        </div>
    </section>
);