"use client";

import { BACKEND_URL } from '@/lib/config';
import { useSearchParams } from 'next/navigation';
import React from 'react'
import useSWR from 'swr';

const fetcher = async (url: string) => {
    return fetch(url).then(res => res.json().then(r => r))
};

const PlaygroundContent = () => {
    const params = useSearchParams();
    console.log(params.get('endpoint_id'));
    const { data, error, isLoading } = useSWR(`${BACKEND_URL}/parameters?endpoint_id=${params.get('endpoint_id')}`, fetcher);

    return (
        <div>
            {JSON.stringify(data)}
            {/* 3 tabs */}
            {/* headers */}
            <div>

            </div>


        </div>
    )
}

export default PlaygroundContent;