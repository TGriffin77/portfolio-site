import { Icon } from "@iconify/react"

type SocialMediaProps = {
    link: string,
    icon: string,
    ariaLabel: string
}

export default function SocialMedia (props: SocialMediaProps) {
    return (
        <a href={props.link} aria-label={props.ariaLabel} className="flex p-1 rounded-md border bg-neutral-200 hover:scale-105 hover:-transform-y-0.5 transition-all duration-300">
            <Icon icon={props.icon} className="inline-block w-8 h-8 sm:w-5 sm:h-5" />
        </a>   
    )
}