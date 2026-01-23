import { Parameter } from "@repo/types"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"

export default function PlaygroundParams({ parameters }: { parameters: Parameter[] }) {
    return <div>
        <h3 className="text-md font-semibold my-2">Parameters</h3>
        <div className="border rounded-md">
            {parameters && parameters.length > 0 && parameters.map((p, idx) => {
                return <div
                    style={{ fontFamily: "var(--font-poppins)" }}
                    className="pb-2"
                >
                    <div className="px-4">
                        <div className="flex space-x-1 items-baseline my-2 ">
                            <p className="text-sm">{p.name}</p>
                            {p.is_required && <p className="text-[0.6rem] bg-red-500 px-1  rounded-lg text-white mx-0.5">required</p>}
                        </div>
                        <Input type="text" placeholder={p.default_value} value={p.default_value} />
                    </div>
                    {idx !== parameters.length - 1 && <Separator className="mt-4" />}
                </div>
            })}
        </div>
    </div>
}