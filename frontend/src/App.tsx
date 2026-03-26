import './App.css'
import { useState, useEffect } from 'react';
import Project from './components/Project';
import Job from './components/Job';
import { TechBlip } from './components/Blips';
import projectAPI from './services/api';
import type { Project as ProjectType } from './types/project';

import thomas128 from './assets/thomas-128w.webp';
import thomas256 from './assets/thomas-256w.webp'

import UCF from "./assets/ucf.webp";
import SocialMedia from './components/SocialMedia';
import Footer from './components/Footer';

export default function App() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProjects = await projectAPI.fetchProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
        setError(errorMessage);
        console.error('Error loading projects:', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => setCopied(true))
      console.log(copied)

    setTimeout(() => setCopied(false), 2000);
  }
  

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
        
        {/* Absolutes */}
        {/* Resume button */}
        {/* Copied */}

        {copied &&
        <div className="fixed flex justify-center mx-auto z-20 bottom-8 w-full">
          <div className="py-2 px-4 bg-green-200 text-green-800 border border-green-800 text-sm rounded-xl animate-bounce">
            Email copied to clipboard!
          </div>
        </div>
        }

        {/* Content */}
        <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-18 lg:py-24 font-inter text-white">
            {/* Header */}
            <div className="flex flex-col-reverse items-center sm:flex-row gap-8 mb-16">
              <img 
                src={thomas128}
                alt="Picture of Thomas" 
                className="w-32 h-32 rounded-full mt-6 self-center sm:self-start"
                srcSet={`${thomas128} 1x ${thomas256} 2x`}
                />
                
              <div className="flex flex-col">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Hey, I am Thomas!</h1>
                <span className="text-sm sm:text-md lg:text-lg text-neutral-400 text-center sm:text-left">Software Engineer • CS Student • AI & Finance Enthuasist</span>
              </div>
              
            </div>

            

            {/* Currently */}
            <h2 className="font-bold text-sm text-neutral-400 mb-8">CURRENTLY</h2>
            <Job title="Student" company="University of Central Florida" image={UCF} duration="Expected Graduation: Dec. 2026" description="Enrolled at University of Central Florida for a Bachelor's of Science in Computer Science. Alongside education, I am also enhanching my skills in backend development and AI integration to seek employment in the tech industry post-graduation." />

            {/* Projects */}
            <h2 className="font-bold text-sm text-neutral-400 mb-8">RECENT PROJECTS</h2>
            
            {loading && (
              <div className="p-8 text-center text-neutral-400">
                <p>Loading projects...</p>
              </div>
            )}

            {error && (
              <div className="p-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <p className="font-semibold">Error loading projects</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {!loading && !error && projects.length === 0 && (
              <div className="p-8 text-center text-neutral-400">
                <p>No projects available yet.</p>
              </div>
            )}

            {!loading && projects.map((project) => (
              <Project 
                key={project.id}
                title={project.title} 
                description={project.description} 
                link={project.link} 
                skills={project.skills} 
              />
            ))}


            {/* Education */}
            <h2 className="font-bold text-sm text-neutral-400 mb-8 mt-16">EDUCATION</h2>
            <Job title="Bachelor's of Science in Computer Science" company="University of Central Florida" image={UCF} duration="Expected Graduation: Dec. 2026" description="Enrolled at University of Central Florida for a Bachelor's of Science in Computer Science." />

            {/* Tech Skills */}
            <h2 className="font-bold text-sm text-neutral-400 mb-8 mt-16">TECHNICAL SKILLS</h2>
            <div className="mb-32">
              <h3 className="text-sm font-bold text-white my-8">Programming and Markdown Languages</h3>
              <div className="flex flex-wrap gap-4">
                <TechBlip text="Python" icon="logos:python" />
                <TechBlip text="JavaScript" icon="logos:javascript" />
                <TechBlip text="TypeScript" icon="logos:typescript-icon" />
                <TechBlip text="Java" icon="logos:java" />
                <TechBlip text="C++" icon="logos:c-plusplus" />
                <TechBlip text="HTML" icon="logos:html-5" />
                <TechBlip text="CSS" icon="logos:css-3" />
                <TechBlip text="Markdown" icon="logos:markdown" />
                <TechBlip text="SQL" icon="logos:postgresql" />
                <TechBlip text="Golang" icon="logos:go" />
              </div>
              
              <h3 className="text-sm font-bold text-white my-8">Frameworks and Libraries</h3>
              <div className="flex flex-wrap gap-4">
                <TechBlip text="React" icon="logos:react" />
                <TechBlip text="Tailwind CSS" icon="logos:tailwindcss-icon" />
                <TechBlip text="Node.js" icon="logos:nodejs-icon" />
                <TechBlip text="Express.js" />
                <TechBlip text="Next.js" icon="logos:nextjs-icon" />
                <TechBlip text="Flask" icon="logos:flask" />
                <TechBlip text="Pocket Base" icon="logos:pocket-base" />
                <TechBlip text="Pytorch" icon="logos:pytorch-icon" />
                <TechBlip text="TensorFlow" icon="logos:tensorflow" />
              </div>

              <h3 className="text-sm font-bold text-white my-8">Tools and Platforms</h3>
              <div className="flex flex-wrap gap-4">
                <TechBlip text="Linux" icon="logos:linux-tux" />
                <TechBlip text="Git" icon="logos:git-icon" />
                <TechBlip text="GitHub" icon="logos:github-icon" />
                <TechBlip text="VS Code" icon="logos:visual-studio-code" />
                <TechBlip text="AWS" icon="logos:aws" />
                <TechBlip text="Docker" icon="logos:docker-icon" />
                <TechBlip text="Vercel" icon="logos:vercel-icon" />
                <TechBlip text="Jira" icon="logos:jira" />
              </div>
            </div>
            

            {/* Contact & Socials */}

            <div className="flex flex-col sm:flex-row justify-between items-center mb-32 py-12 bg-[#121212]/75 backdrop-blur-md shadow-lg border border-neutral-950/10 rounded-[15px] p-6 hover:-translate-y-0.5 hover:scale-101 transition-all duration-300 text-sm text-gray-300">
              
              <div className="flex-1 flex flex-col gap-2 items-center pb-4 sm:pb-0 border-b sm:border-r sm:border-b-0 border-neutral-400 ">
                <p>Contact me at:</p>
                <div onClick={() => {handleCopy("tjgriffin@proton.me")}} className="py-2 px-4 select-none bg-black/80 rounded-lg text-white font-bold hover:cursor-pointer hover:scale-105 hover:-transform-y-0.5 transition-all duration-300">
                  tjgriffin@proton.me
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-2 pt-4 sm:pt-0 items-center">
                <p>Find me on:</p>
                <div className="flex gap-2">
                  <SocialMedia link="https://github.com/TGriffin77" ariaLabel="GitHub" icon="logos:github-icon" />
                  <SocialMedia link="https://www.linkedin.com/in/thomasgriffinx/" ariaLabel="LinkedIn" icon="logos:linkedin-icon" />           
                </div>
              </div>
            </div>
            <Footer />
          </main>

      </div>
      
  );
}