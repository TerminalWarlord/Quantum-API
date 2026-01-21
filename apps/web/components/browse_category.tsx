import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"




export default function BrowseCategory({ categories }: { categories: { id: number, title: string }[] }) {
    return <div className="w-80 h-screen hidden md:block">
        <h4 className="font-medium tracking-tight">Categories</h4>
        <div className="flex flex-col justify-center space-y-2 py-2">
            {categories.map(cat => {
                return <div className="flex space-x-1 items-center" key={cat.id}>
                    <Checkbox
                        className="border-cyan-400!
                        data-[state=checked]:border-cyan-400!
                        data-[state=checked]:bg-cyan-400!
                        data-[state=checked]:text-white
                        dark:data-[state=checked]:text-black
                        "
                    />
                    <Label htmlFor={cat.id.toString()} className="cursor-pointer font-semibold" >
                        {cat.title}
                    </Label>
                </div>
            })}
        </div>
    </div>
}