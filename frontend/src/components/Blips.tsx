import { Icon } from '@iconify/react';

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
        <div className="flex items-center bg-[#121212]/75 backdrop-blur-md border border-neutral-950/10 text-sm px-4 py-2 rounded-full">
            <Icon icon={props.icon || "mdi:code-tags"} className="inline-block mr-2 text-neutral-400" />
            <p className="text-sm">
                {props.text}
            </p>
        </div>
        
    )
}

export { ProjectBlip, TechBlip }