import { ProjectBlip } from "./Blips";

type ProjectProps = {
    title: string;
    description: string;
    link: string;
    skills: string[];
};


export default function Project (props: ProjectProps) {

    const useLink = () => {
        window.location.href = props.link;
    }

    return (
        <div className="bg-[#121212]/75 backdrop-blur-md border border-neutral-800/10 rounded-[15px] p-6 hover:-translate-y-0.5 hover:scale-101 transition-all duration-300">
            <h3 className="text-xl font-bold text-white">{props.title}</h3>
            
            
            <p className="text-gray-400 mt-2">{props.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-4">
                <div className="flex flex-wrap gap-2 mt-4">
                    {props.skills.map((skill, index) => (
                        <ProjectBlip key={index} text={skill} />
                    ))}
                </div>
                <button onClick={useLink} className="flex gap-2 items-center text-white border-2 border-neutral-800 text-lg rounded-xl p-2 hover:cursor-pointer hover:scale-105 hover:shadow-[0_0_16px_rgba(6,182,212,.4)] transition-all duration-300">
                    View Project
                    <svg height="24px" width="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Interface / External_Link">
                            <path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                    </svg>
                </button>
            </div>
            
        </div>
    )
}