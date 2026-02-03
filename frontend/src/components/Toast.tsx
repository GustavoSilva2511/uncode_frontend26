export default function Toast({ message }: { message: string }) {
    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 w-80 max-w-md text-center">
            {message}
        </div>
    );
}  