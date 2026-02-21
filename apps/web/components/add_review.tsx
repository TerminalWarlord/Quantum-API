import useSWR from "swr";
import { Button } from "./ui/button";
import { InputGroup } from "./ui/input-group";
import { Textarea } from "./ui/textarea";
import { BACKEND_URL } from "@/lib/config";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { createToken } from "@/lib/create_token";
import { Review, ReviewResponse } from "@repo/types";
import { toast } from "sonner";
import Loading from "./ui/loading";
import ReviewCard from "./api_page/review_card";
import { FormEvent, useState } from "react";
import { IconSend, IconStarFilled } from "@tabler/icons-react";
import { createReviewStars } from "@/lib/get_reviews";
import { submitForm } from "@/lib/user_dashboard/submit_form";
import NoResults from "./ui/no_results";

type AddReviewProps = {
    apiSlug: string
}

const fetcher = async (url: string, session: Session | null) => {
    try {

        const token = await createToken(session);
        const res = await fetch(BACKEND_URL + url, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.message || "Failed to fetch data");
        }
        return resData as {
            can_review: boolean,
            review: ReviewResponse
        }
    }
    catch (err) {
        if (err instanceof Error) {
            toast.error(err.message);
        }
        else toast.error("Failed to fetch data");
    }
}

export default function AddReview({ apiSlug }: AddReviewProps) {
    const session = useSession();
    const { data, isLoading, error, mutate } = useSWR(`/manage/review/${apiSlug}`, (url) => fetcher(url, session.data));
    const [rating, setRating] = useState(1);

    const [filled, remaining] = createReviewStars(rating);

    if (error) {
        return <NoResults resultType="Reviews yet." />
    }
    const updateRating = (val: number) => {
        console.log(val)
        setRating(val);
    }

    const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.currentTarget);

            const content = formData.get('content') as string;
            if (!content) {
                throw new Error("Review can't be empty!");
            }
            const body = {
                content,
                api_slug: apiSlug,
                rating
            };
            await submitForm(
                {
                    content,
                    api_slug: apiSlug,
                    rating
                },
                session.data,
                `${BACKEND_URL}/manage/create-review`
            );
            toast.success("Review added");
            await mutate();
        }
        catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            }
            else toast.error("Failed to post review");
        }
    }
    return <div>
        {isLoading && <Loading />}
        {data && data.review &&
            <ReviewCard review={data.review} />
        }
        {data && !data.review && data.can_review &&
            <form
                onSubmit={submitFormHandler}
                className="max-w-3/4"
            >
                <InputGroup>
                    <Textarea

                        placeholder="Write a cool review..."
                        name="content"
                    />
                </InputGroup>
                <div className="flex items-center justify-between">
                    <div className="flex space-x-1 text-yellow-400">
                        {filled.map((Icon, i) => {
                            return <Icon
                                onClick={() => updateRating(i + 1)}
                                key={i}
                                className="w-5 h-5 cursor-pointer transition-transform duration-150 active:scale-90"
                            />
                        })}
                        {remaining.map((Icon, i) => {
                            return <Icon
                                onClick={() => updateRating((filled.length) + i + 1)}
                                key={i}
                                className="w-5 h-5 cursor-pointer transition-transform duration-150 active:scale-90"
                            />
                        })}
                    </div>
                    <Button
                        className="my-2 cursor-pointer"
                        size={'sm'}
                    >
                        <IconSend className="w-5 h-5"/>
                        <span>Post Review</span>
                    </Button>
                </div>
            </form>}
    </div>
}