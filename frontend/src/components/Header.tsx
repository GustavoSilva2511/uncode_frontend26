export default function Header({ title = "Uncode Frontend", right, left }: { title?: string, right?: React.ReactNode, left?: React.ReactNode }) {
    return (
        <header className='w-full h-16 flex items-center justify-between bg-blue-600 px-4 shadow-md flex-row'>
            
            {left && <div className="grow-1 flex justify-start">{left}</div>}
            
            <div className="grow-9">
                <h1 className='text-white text-2xl font-bold'>{title}</h1>
            </div>
            {right && <div className="grow-1 flex justify-end">{right}</div>}
            
        </header>
    )
}