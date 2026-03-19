
type ProjectBlipProps = {
    text: string;
};

function ProjectBlip({ text }: ProjectBlipProps) {
    return (
        <span className="bg-[#c3dee9] text-[#005475] text-xs font-bold px-3 py-1.5 border border-[#61b4c2] rounded-lg hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_0_16px_rgba(6,182,212,.4)] transition-all duration-300">
            {text}
        </span>
    )
}

function TechBlip({ text }: ProjectBlipProps) {
    return (
        <span className="bg-[#1a1a1a]/80 text-white text-sm px-3 py-1.5 rounded-full">
            {text}
        </span>
    )
}

export { ProjectBlip, TechBlip }