import { IconMoodSadDizzy } from "@tabler/icons-react";

export default function NoResults(){
    return <div className="w-full px-4 flex flex-col items-center justify-center py-12">
        <IconMoodSadDizzy size={45}/>
        <p className="tracking-tight">No results!</p>
    </div>
}