export interface ApiEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  name: string;
  description: string;
  parameters: {
    name: string;
    type: "path" | "query" | "header" | "body";
    required: boolean;
    description: string;
  }[];
  exampleRequest?: string;
  exampleResponse?: string;
}

export interface ApiPlan {
  id: string;
  name: string;
  price: number;
  requestsPerMonth: number;
  features: string[];
}

export interface Api {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  logo: string;
  category: string;
  pricingType: "free" | "paid" | "freemium";
  rating: number;
  subscribers: number;
  authType: "apiKey" | "oauth2" | "none";
  baseUrl: string;
  status: "live" | "beta" | "deprecated";
  owner: string;
  endpoints: ApiEndpoint[];
  plans: ApiPlan[];
  useCases: string[];
}

export const mockApis: Api[] = [
  {
    id: "1",
    slug: "openai-gpt",
    name: "OpenAI GPT",
    shortDescription: "Access GPT-4 and GPT-3.5 models for text generation, conversation, and more.",
    fullDescription: "The OpenAI API provides access to GPT-4 and GPT-3.5 models for a variety of natural language tasks, code generation, and more. Build intelligent applications with state-of-the-art AI capabilities.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1024px-OpenAI_Logo.svg.png",
    category: "AI & Machine Learning",
    pricingType: "paid",
    rating: 4.9,
    subscribers: 125000,
    authType: "apiKey",
    baseUrl: "https://api.openai.com/v1",
    status: "live",
    owner: "OpenAI",
    useCases: [
      "Build conversational AI chatbots",
      "Generate and edit code",
      "Summarize and translate text",
      "Create content at scale"
    ],
    endpoints: [
      {
        id: "e1",
        method: "POST",
        path: "/chat/completions",
        name: "Create Chat Completion",
        description: "Creates a model response for the given chat conversation.",
        parameters: [
          { name: "model", type: "body", required: true, description: "ID of the model to use" },
          { name: "messages", type: "body", required: true, description: "Array of messages in the conversation" },
          { name: "temperature", type: "body", required: false, description: "Sampling temperature (0-2)" }
        ],
        exampleRequest: `{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ]
}`,
        exampleResponse: `{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you today?"
    }
  }]
}`
      },
      {
        id: "e2",
        method: "GET",
        path: "/models",
        name: "List Models",
        description: "Lists the currently available models.",
        parameters: [],
        exampleResponse: `{
  "data": [
    {"id": "gpt-4", "object": "model"},
    {"id": "gpt-3.5-turbo", "object": "model"}
  ]
}`
      }
    ],
    plans: [
      { id: "p1", name: "Pay As You Go", price: 0, requestsPerMonth: 0, features: ["$0.03 per 1K tokens", "Access to GPT-3.5", "Standard support"] },
      { id: "p2", name: "Pro", price: 20, requestsPerMonth: 100000, features: ["$0.02 per 1K tokens", "Access to GPT-4", "Priority support"] },
      { id: "p3", name: "Enterprise", price: -1, requestsPerMonth: -1, features: ["Custom pricing", "Dedicated support", "SLA guarantee"] }
    ]
  },
  {
    id: "2",
    slug: "stripe-payments",
    name: "Stripe Payments",
    shortDescription: "Accept payments, manage subscriptions, and handle invoicing.",
    fullDescription: "Stripe's APIs power commerce for millions of businesses worldwide. Process payments, manage subscriptions, prevent fraud, and more with a unified API.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png",
    category: "Payments",
    pricingType: "freemium",
    rating: 4.8,
    subscribers: 89000,
    authType: "apiKey",
    baseUrl: "https://api.stripe.com/v1",
    status: "live",
    owner: "Stripe",
    useCases: [
      "Accept online payments",
      "Manage recurring subscriptions",
      "Handle invoicing and billing",
      "Prevent payment fraud"
    ],
    endpoints: [
      {
        id: "e1",
        method: "POST",
        path: "/customers",
        name: "Create Customer",
        description: "Creates a new customer object.",
        parameters: [
          { name: "email", type: "body", required: false, description: "Customer's email address" },
          { name: "name", type: "body", required: false, description: "Customer's full name" }
        ],
        exampleRequest: `{
  "email": "customer@example.com",
  "name": "John Doe"
}`,
        exampleResponse: `{
  "id": "cus_123456789",
  "object": "customer",
  "email": "customer@example.com"
}`
      }
    ],
    plans: [
      { id: "p1", name: "Free", price: 0, requestsPerMonth: 1000, features: ["Basic API access", "Test mode", "Email support"] },
      { id: "p2", name: "Standard", price: 25, requestsPerMonth: 50000, features: ["Full API access", "Live mode", "Priority support"] }
    ]
  },
  {
    id: "3",
    slug: "weather-api",
    name: "Weather API",
    shortDescription: "Real-time weather data, forecasts, and historical weather information.",
    fullDescription: "Get accurate weather data for any location in the world. Access current conditions, hourly forecasts, 7-day predictions, and historical weather data.",
    logo: "https://cdn-icons-png.flaticon.com/512/1779/1779940.png",
    category: "Weather",
    pricingType: "free",
    rating: 4.5,
    subscribers: 45000,
    authType: "apiKey",
    baseUrl: "https://api.weather.example.com/v1",
    status: "live",
    owner: "WeatherCorp",
    useCases: [
      "Display weather widgets",
      "Plan outdoor events",
      "Agricultural forecasting",
      "Travel planning apps"
    ],
    endpoints: [
      {
        id: "e1",
        method: "GET",
        path: "/current",
        name: "Get Current Weather",
        description: "Returns current weather conditions for a location.",
        parameters: [
          { name: "location", type: "query", required: true, description: "City name or coordinates" },
          { name: "units", type: "query", required: false, description: "Temperature units (metric/imperial)" }
        ],
        exampleResponse: `{
  "location": "San Francisco",
  "temperature": 18,
  "condition": "Partly Cloudy",
  "humidity": 65
}`
      }
    ],
    plans: [
      { id: "p1", name: "Free", price: 0, requestsPerMonth: 10000, features: ["Current weather", "Basic forecasts", "Community support"] }
    ]
  },
  {
    id: "4",
    slug: "twilio-sms",
    name: "Twilio SMS",
    shortDescription: "Send and receive SMS messages globally with reliable delivery.",
    fullDescription: "Twilio's programmable SMS API lets you send and receive text messages worldwide. Build notifications, two-factor authentication, and marketing campaigns.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Twilio-logo-red.svg/2560px-Twilio-logo-red.svg.png",
    category: "Messaging",
    pricingType: "paid",
    rating: 4.7,
    subscribers: 67000,
    authType: "apiKey",
    baseUrl: "https://api.twilio.com/2010-04-01",
    status: "live",
    owner: "Twilio",
    useCases: [
      "Send OTP codes",
      "Appointment reminders",
      "Marketing campaigns",
      "Customer notifications"
    ],
    endpoints: [
      {
        id: "e1",
        method: "POST",
        path: "/Messages",
        name: "Send Message",
        description: "Sends an SMS message to a phone number.",
        parameters: [
          { name: "To", type: "body", required: true, description: "Recipient phone number" },
          { name: "From", type: "body", required: true, description: "Sender phone number" },
          { name: "Body", type: "body", required: true, description: "Message content" }
        ],
        exampleRequest: `{
  "To": "+1234567890",
  "From": "+0987654321",
  "Body": "Hello from Twilio!"
}`,
        exampleResponse: `{
  "sid": "SM123456789",
  "status": "queued"
}`
      }
    ],
    plans: [
      { id: "p1", name: "Pay Per Use", price: 0, requestsPerMonth: 0, features: ["$0.0075 per SMS", "Global delivery", "Delivery reports"] }
    ]
  },
  {
    id: "5",
    slug: "google-maps",
    name: "Google Maps Platform",
    shortDescription: "Maps, routes, places, and geolocation services.",
    fullDescription: "Build location-aware applications with Google Maps Platform. Access maps, geocoding, directions, places, and more through a unified API.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/1024px-Google_Maps_Logo_2020.svg.png",
    category: "Maps & Location",
    pricingType: "freemium",
    rating: 4.6,
    subscribers: 112000,
    authType: "apiKey",
    baseUrl: "https://maps.googleapis.com/maps/api",
    status: "live",
    owner: "Google",
    useCases: [
      "Display interactive maps",
      "Calculate routes and ETAs",
      "Find nearby places",
      "Geocode addresses"
    ],
    endpoints: [
      {
        id: "e1",
        method: "GET",
        path: "/geocode/json",
        name: "Geocode Address",
        description: "Converts addresses to geographic coordinates.",
        parameters: [
          { name: "address", type: "query", required: true, description: "The address to geocode" },
          { name: "key", type: "query", required: true, description: "Your API key" }
        ],
        exampleResponse: `{
  "results": [{
    "geometry": {
      "location": {"lat": 37.7749, "lng": -122.4194}
    }
  }]
}`
      }
    ],
    plans: [
      { id: "p1", name: "Free Tier", price: 0, requestsPerMonth: 28500, features: ["$200 monthly credit", "All APIs access"] },
      { id: "p2", name: "Standard", price: 0, requestsPerMonth: -1, features: ["Pay as you go", "Volume discounts"] }
    ]
  },
  {
    id: "6",
    slug: "sendgrid-email",
    name: "SendGrid Email",
    shortDescription: "Transactional and marketing email delivery at scale.",
    fullDescription: "SendGrid provides email delivery infrastructure for transactional and marketing emails. Ensure your emails reach the inbox with industry-leading deliverability.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/SendGrid_2016_Logo.png/1200px-SendGrid_2016_Logo.png",
    category: "Email",
    pricingType: "freemium",
    rating: 4.4,
    subscribers: 54000,
    authType: "apiKey",
    baseUrl: "https://api.sendgrid.com/v3",
    status: "live",
    owner: "Twilio",
    useCases: [
      "Transactional emails",
      "Marketing campaigns",
      "Password reset emails",
      "Order confirmations"
    ],
    endpoints: [
      {
        id: "e1",
        method: "POST",
        path: "/mail/send",
        name: "Send Email",
        description: "Sends an email using SendGrid.",
        parameters: [
          { name: "personalizations", type: "body", required: true, description: "Array of recipient details" },
          { name: "from", type: "body", required: true, description: "Sender email address" },
          { name: "content", type: "body", required: true, description: "Email content" }
        ],
        exampleRequest: `{
  "personalizations": [{"to": [{"email": "user@example.com"}]}],
  "from": {"email": "sender@example.com"},
  "content": [{"type": "text/plain", "value": "Hello!"}]
}`
      }
    ],
    plans: [
      { id: "p1", name: "Free", price: 0, requestsPerMonth: 100, features: ["100 emails/day", "Basic analytics"] },
      { id: "p2", name: "Essentials", price: 19.95, requestsPerMonth: 50000, features: ["50K emails/month", "Dedicated IP"] }
    ]
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
