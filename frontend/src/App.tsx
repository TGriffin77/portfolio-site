import './App.css'
import Project from './components/Project';

import Thomas from "./assets/thomas.webp";

export default function App() {
  return (
      <div className="relative min-h-screen">

        {/* Background gradient */}
        <div className="fixed inset-0 -z-10 w-screen bg-linear-to-b from-neutral-900 to-neutral-900" />

        {/* Blobs */}
        <div className="fixed top-[0%] right-[5%] w-[80vw] max-w-300 aspect-square  bg-cyan-500/5 blur-[60px] -z-10 animate-pulse-glow"/>
        <div className="fixed bottom-[0%] right-[15%] w-[80vw] max-w-300  aspect-square  bg-purple-500/5 blur-[60px] -z-10 animate-pulse-glow"/>
        <div className="fixed top-[5%] left-[5%] w-[80vw] max-w-300  aspect-square  bg-green-500/5 blur-[60px] -z-10 animate-pulse-glow"/>
        
        {/* Grainy gradient */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none -z-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"/>
        
        {/* Content */}
        <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18 lg:py-24 font-inter text-white">
            {/* Header */}
            <div className="flex flex-col-reverse items-center sm:flex-row gap-8 mb-12">
              <img src={Thomas} alt="Picture of Thomas" className="w-32 h-32 rounded-full mt-6 self-center sm:self-start"/>
              <div className="flex flex-col">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Hey, I am Thomas!</h1>
                <span className="text-sm sm:text-md lg:text-lg text-neutral-500 text-center sm:text-left">Software Engineer • CS Student • AI & Finance Enthuasist</span>
              </div>
              
            </div>

            
            {/* Currently */}

            {/* Projects */}
            <Project title="Website" description="A responsive website built with React and Tailwind CSS." link="https://github.com/TGriffin77" skills={["React", "Tailwind CSS"]} />


            {/* Education */}

            {/* Tech Skills */}

          </main>
      </div>
      
  );
}