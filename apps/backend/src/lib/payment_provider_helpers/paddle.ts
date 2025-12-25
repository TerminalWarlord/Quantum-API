const PADDLE_API_KEY = process.env.PADDLE_API_KEY || "";
const PADDLE_ENVIRONMENT = process.env.PADDLE_ENVIRONMENT || "sandbox";

export const BASE_URL = PADDLE_ENVIRONMENT === "sandbox" ?
    "https://sandbox-api.paddle.com" :
    "https://api.paddle.com";


export async function createProduct(
    {
        name,
        description,
        image_url,

    }:
        {
            name: string,
            description: string,
            image_url: string | undefined

        }
) {
    const res = await fetch(BASE_URL + '/products', {
        method: "POST",
        headers: {
            Authorization: "Bearer " + PADDLE_API_KEY
        },
        body: JSON.stringify({
            name,
            description,
            image_url,
            tax_category: "standard",
        })

    });
    const resData = await res.json();
    console.log(resData);
    return resData.data.id;
}



export async function createPrice(
    {
        name,
        price,
        productId,
        description,
        currency,
    }:
        {
            name: string,
            price: number,
            productId: string,
            description: string,
            currency: string,
        }
) {
    const res = await fetch(BASE_URL + '/prices', {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + PADDLE_API_KEY
        },
        body: JSON.stringify({
            name,
            description,
            product_id: productId,
            unit_price: {
                currency_code: currency,
                amount: price.toString()
            },
            billing_cycle: {
                interval: "month",
                frequency: 1
            },
            tax_mode: "external"
        })

    })
    const resData = await res.json();
    return resData.data.id;
}
