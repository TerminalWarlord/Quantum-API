// export interface ApiEndpoint {
//   id: string;
//   method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
//   path: string;
//   name: string;
//   description: string;
//   parameters: {
//     name: string;
//     type: "path" | "query" | "header" | "body";
//     required: boolean;
//     description: string;
//   }[];
//   exampleRequest?: string;
//   exampleResponse?: string;
// }

import { Api, ApiStatus } from "@repo/types";

// export interface ApiPlan {
//   id: string;
//   name: string;
//   price: number;
//   requestsPerMonth: number;
//   features: string[];
// }

// export interface Api {
//   id: string;
//   slug: string;
//   name: string;
//   shortDescription: string;
//   fullDescription: string;
//   logo: string;
//   category: string;
//   pricingType: "free" | "paid" | "freemium";
//   rating: number;
//   subscribers: number;
//   authType: "apiKey" | "oauth2" | "none";
//   baseUrl: string;
//   status: "live" | "beta" | "deprecated";
//   owner: string;
//   endpoints: ApiEndpoint[];
//   plans: ApiPlan[];
//   useCases: string[];
// }

export const mockApis: Api[] = [
  {
    id: 1,
    slug: "openai-gpt",
    title: "OpenAI GPT",
    category_id: 1,
    status: ApiStatus.ENABLED,
    description: "Access GPT-4 and GPT-3.5 models for text generation, conversation, and more.",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1024px-OpenAI_Logo.svg.png"
  },
  {
    id: 2,
    slug: "stripe-payments",
    title: "Stripe Payments",
    description: "Accept payments, manage subscriptions, and handle invoicing.",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png",
    category_id: 2,
    base_url: "https://api.stripe.com/v1",
    status: ApiStatus.ENABLED
  },
  {
    id: 3,
    slug: "weather-api",
    title: "Weather API",
    description: "Real-time weather data, forecasts, and historical weather information.",
    thumbnail_url: "https://cdn-icons-png.flaticon.com/512/1779/1779940.png",
    category_id: 4,
    base_url: "https://api.weather.example.com/v1",
    status: ApiStatus.ENABLED
  },
  {
    id: 4,
    slug: "twilio-sms",
    title: "Twilio SMS",
    description: "Send and receive SMS messages globally with reliable delivery.",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Twilio-logo-red.svg/2560px-Twilio-logo-red.svg.png",
    category_id: 7,
    base_url: "https://api.twilio.com/2010-04-01",
    status: ApiStatus.ENABLED
  },

  {
    id: 8,
    slug: "twilio-sms",
    title: "Twilio SMS",
    description: "Send and receive SMS messages globally withreliable delivery.Sendand receive SMS messages globally with reliable delivery.Send and receive SMS messages globally with reliable delivery.",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Twilio-logo-red.svg/2560px-Twilio-logo-red.svg.png",
    category_id: 7,
    base_url: "https://api.twilio.com/2010-04-01",
    status: ApiStatus.ENABLED
  }
];

export const categories = [
  "AI & Machine Learning",
  "Payments",
  "Weather",
  "Messaging",
  "Maps & Location",
  "Email",
  "Data & Analytics",
  "Social Media",
  "Finance",
  "E-commerce"
];
