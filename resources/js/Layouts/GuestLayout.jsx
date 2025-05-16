import iconCL from "../../../public/assets/img/icon-clinisindo.svg";
import bg from "../../../public/assets/img/bg-icon.svg";

export default function GuestLayout({ children }) {
    return (
        <>
            <div className="flex min-h-screen flex-col items-center sm:justify-center sm:pt-0">
                <img
                    id="background"
                    className="absolute h-screen overflow-hidden object-cover -z-50 w-full"
                    src={bg}
                />
                <div></div>
                <div className="grid grid-cols-2 gap-40">
                    <div className="bg-blue-100 flex justify-center ml-20 bg-transparent">
                        <img src={iconCL} className="image rounded-lg" />
                    </div>

                    <div className="mt-6 w-full overflow-hidden px-6 py-4 shadow-md sm:max-w-md bg-white sm:rounded-lg">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
