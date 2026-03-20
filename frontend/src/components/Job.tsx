
type JobProps = {
  title: string;
  company: string;
  logo?: string;
  image?: string;
  duration: string;
  description: string;
};

export default function Job(props: JobProps) {
    return (
        <div className="mb-16">
            <div className="flex flex-row mb-2 gap-4">
                {props.logo && <img src={props.logo} alt={`${props.company} logo`} className="w-12 h-12 rounded-lg mb-4"/>}
                {props.image && <img src={props.image} alt={`${props.company} image`} className="w-12 h-12 rounded-lg mb-4 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"/>}
                <div className="mb-2">
                    <h3 className="text-lg font-bold">{props.title}</h3>
                    <p className="text-sm text-neutral-400 mb-1">{props.company}</p>
                    <p className="text-sm text-neutral-400">{props.duration}</p>
                </div>
            </div>
            <p className="text-sm text-neutral-400">{props.description}</p>
        </div>
    )
}