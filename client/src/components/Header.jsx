export default function Header({title, subtitle}) {
    return (
        <div>
            {title && <h1 className="text-5xl font-semibold text-stone-800 tracking-tight mb-5 text-center">{title}</h1>}
            {subtitle && <p className="text-xs tracking-[0.2em] uppercase text-stone-400 font-medium text-center">{subtitle}</p>}
        </div>
    )
}