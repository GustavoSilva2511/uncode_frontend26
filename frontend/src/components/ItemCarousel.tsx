import { NavLink } from "react-router";

export default function ItemCarousel({ size, image, title, price, id }: { size?: "small" | "large"; image: string; title: string; price: number; id: number }) {
    return (
        <NavLink className="snap-start" title={title} to={"/" + id} end>
            <div className={`flex flex-col justify-between border border-gray-300 rounded-lg p-2 shadow-md hover:shadow-lg transition-shadow duration-300 ${size === "small" ? "w-40 h-48" : "h-80 w-50"}`}>
                {size === "small" ? <img src={image} alt={title} title={title} className="w-full h-33 object-cover rounded-md mb-1" /> : <img src={image} alt={title} title={title} className="w-full h-48 object-cover rounded-md mb-1" />}
                {size === "small" ? <h2 className="text-sm font-semibold overflow-hidden whitespace-nowrap">{title}</h2> : <h2 className="text-lg font-semibold mb-2">{title}</h2>}
                {size === "small" ? <p className="text-sm font-bold">R$ {price  }</p> : <p className="text-lg font-bold">R$ {price}</p>}
            </div>
        </NavLink>
    )
}