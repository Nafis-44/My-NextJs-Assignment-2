import Image from "next/image";
import Hero from '../../../public/banner.png'

const Banner = () => {
  return (
    <section className="w-full bg-[#181818] py-10 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        
        <div className="grid grid-cols-1 items-stretch gap-8 rounded-2xl bg-[#1e1e1e] p-8 md:grid-cols-2 md:p-12 lg:p-16">
          
          
          <div className="flex flex-col justify-center space-y-5">
            
            <p className="text-xs font-bold tracking-[0.2em] text-[#CCFF00]">
              WORKOUT LIBRARY
            </p>

            
            <h1 className="text-3xl sm:text-5xl lg:text-4xl font-black ">
              TRAIN WITH INTENT.LOG  <br />EVERY SET.
            </h1>

           
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md">
                FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
into today plan, and watch the week work add up.
            </p>

            <div className="pt-2">
              <a
                href="#library"
                className="inline-flex items-center gap-2 rounded-xl bg-[#CCFF00] px-6 py-3 text-xs sm:text-sm font-extrabold text-black hover:opacity-90 transition-all"
              >
                BROWSE WORKOUTS
                
              </a>
            </div>
          </div>

          
          <div className="relative min-h-70  overflow-hidden rounded-xl">
            <Image
              src={Hero}
              alt="Workout Banner"
              fill
              className="object-contain "
              
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;