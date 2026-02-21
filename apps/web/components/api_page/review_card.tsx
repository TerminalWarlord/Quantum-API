import { createReviewStars } from "@/lib/get_reviews";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Review, ReviewResponse } from "@repo/types";


type ReviewCardProps = {
    review: ReviewResponse
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const [filled, remaining] = createReviewStars(review.rating);
    console.log(filled, remaining, review.rating)
    return <div className="w-full p-2 rounded-sm">
        <div className="flex flex-col sm:flex-row space-x-2 w-full items-start sm:items-center  justify-between">
            <div className="flex space-x-2 items-center justify-center">
                <Avatar className="shadow w-12 h-12">
                    <AvatarImage
                        src={review.image}
                        alt="User Avatar"
                        className="grayscale"
                    />
                    <AvatarFallback>{review.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-sm font-bold font-sans">{review.name}</h2>
                    <div className=" flex">
                        <div className="text-yellow-400 flex">
                            {filled.map((Icon, i) => {
                                return <Icon key={i} size={15} />
                            })}
                        </div>
                        <div className="text-yellow-400 flex">
                            {remaining.map((Icon, i) => {
                                return <Icon key={i} size={15} />
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p className="text-sm tracking-tight my-1">{review.content}</p>
    </div>
}