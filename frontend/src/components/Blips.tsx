import { Icon } from '@iconify/react';
import BorderGlow from './BorderGlow'

type ProjectBlipProps = {
    text: string;
};

type TechBlipProps = {
    text: string;
    icon?: string;
};

function ProjectBlip(props: ProjectBlipProps) {
    return (
        <span className="bg-[#c3dee9] text-[#005475] text-xs font-bold px-3 py-1.5 border border-[#61b4c2] rounded-lg hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_0_16px_rgba(6,182,212,.4)] transition-all duration-300">
            {props.text}
        </span>
    )
}

function TechBlip(props: TechBlipProps) {
    return (
        <BorderGlow 
        glowColor="200 80 70"
        backgroundColor="#1a1a1a"
        coneSpread={5}
        edgeSensitivity={0}
        colors={["#00c951","#00b8db","#ad46ff"]}
        className="hover:scale-105 hover:-transform-y-0.5 transition-all duration-300"
        >
            <div className="flex items-center text-sm px-4 py-2">
                <Icon icon={props.icon || "mdi:code-tags"} className="inline-block mr-2 text-neutral-400" />
                <p className="text-sm">
                    {props.text}
                </p>
            </div>
        </BorderGlow>
        
    )
}

export { ProjectBlip, TechBlip }