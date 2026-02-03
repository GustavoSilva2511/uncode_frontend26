import { NavLink } from "react-router";

export default function CardItem({ size, image, title, price, id }: { size?: "small" | "large"; image: string; title: string; price: number; id: number }) {
    return (
        <NavLink title={title} to={"/" + id} end>
            <div className={`border border-gray-300 rounded-lg p-4 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 ${size === "small" ? "w-40 h-48" : "h-80"}`}>
                <img src={image} alt={title} title={title} className="w-full h-48 object-cover rounded-md mb-2" />
                <h2 className="text-sm font-semibold mb-2">{title}</h2>
                <p className="text-lg font-bold">R$ {price  }</p>
            </div>
        </NavLink>
    )
}