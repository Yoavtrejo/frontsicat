import { Proyecto } from "../../hooks/proyectos";
import { useInegiIndicador } from "../../hooks/useInegi";

export const Card = ({ proy, onClick }: { proy: Proyecto; onClick: () => void }) => {

  const poblacion = useInegiIndicador("1002000001", proy.entidad);
  const viviendas = useInegiIndicador("1003000001", proy.entidad);

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-[#77a6a1]/20 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
        <img
          src={proy.image}
          alt={proy.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold">
          {proy.municipios} Municipios
        </div>
      </div>

      <span className="text-[#77a6a1] text-[10px] font-black uppercase tracking-widest">
        {proy.tag}
      </span>

      <h5 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
        {proy.title}
      </h5>

      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold">
            Población
          </p>
          <p className="text-sm font-semibold dark:text-slate-300">
            {poblacion !== null
              ? `${(poblacion / 1_000_000).toFixed(2)}M`
              : "Cargando..."}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold">
            Viviendas
          </p>
          <p className="text-sm font-semibold dark:text-slate-300">
            {viviendas !== null
            ? `${(viviendas / 1000).toFixed(0)}K`
            : "Cargando..."}
          </p>
        </div>
      </div>
    </div>
  );
};
