import { IconCamera, IconLoader } from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { BACKEND_URL } from "@/lib/config";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/user_store";


export interface User {
    first_name: string,
    last_name?: string | null,
    username: string,
    email: string,
    image: string
}

export default function EditAvatar() {
    const session = useSession();
    const userData = useUserStore(s => s.user);
    const updateData = useUserStore(s => s.updateData);
    const [isUploading, setIsUploading] = useState(false);
    useEffect(() => {
        if (!session || !session.data?.user.id || !userData) {
            return
        }
        const input = document.getElementById("image") as HTMLInputElement;
        const div = document.getElementById("file_btn") as HTMLDivElement;
        if (!div || !input) return;

        div.addEventListener('click', () => {
            input.click();
        })
        input.onchange = async () => {
            if (!input.files) return;
            console.log(input.files);
            const file = input.files[0];
            try {
                setIsUploading(true);
                // TODO: probably would move uploading logic to next's backend
                const tokenRes = await fetch('/api/token', {
                    credentials: "include",
                    method: "POST",
                    body: JSON.stringify({
                        id: session.data.user.id
                    })
                });
                if (!tokenRes.ok) {
                    throw new Error("Failed generate token!");
                }
                const { token } = await tokenRes.json();

                const res = await fetch(`${BACKEND_URL}/upload`, {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        contentType: file.type,
                        fileName: file.name
                    })
                });
                if (!res.ok) {
                    throw new Error("Failed to upload image!");
                }
                const resData = await res.json();

                console.log(resData)


                await fetch(resData.upload_url, {
                    method: "PUT",
                    body: file
                })

                const updateAvatarRes = await fetch(`${BACKEND_URL}/upload/update-avatar`, {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        path: resData.path
                    })
                });
                if (!updateAvatarRes.ok) {
                    throw new Error("Failed to update ")
                }
                console.log("Successful");
                const updateAvatarResData = await updateAvatarRes.json();
                console.log(updateAvatarResData)

                updateData({
                    ...userData,
                    image: updateAvatarResData.image_url
                });
                setIsUploading(false);
            }
            catch (err: any) {
                setIsUploading(false);
                toast.error(err.message || "Failed to upload image!");
            }
        }
    }, [session, userData])

    return <div className="relative w-fit">

        {isUploading ? <Avatar className="w-20 h-20 shadow border flex items-center justify-center">
            <IconLoader className="animate-spin"/>
        </Avatar> : <>
            <Avatar className="w-20 h-20 shadow">
                {userData?.image && <img src={userData.image} />}
                <AvatarFallback className="text-3xl">U</AvatarFallback>
            </Avatar>

            <input type="file" id="image" hidden accept="image/*" />
            <div
                className="absolute bottom-0 right-0"
                id="file_btn"
            >
                <div className="p-2 bg-linear-to-br from-cyan-400 to-cyan-400/70  rounded-full">
                    <IconCamera className="w-4 h-4 text-white" />
                </div>
            </div>
        </>}

    </div>
}