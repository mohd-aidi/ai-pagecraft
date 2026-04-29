import { BookOpen, CreditCard, Layout, LogIn, Mail, Search, ShoppingBag, User } from "lucide-react";

export interface Template {
  id: string;
  name: string;
  icon: any;
  prompt: string;
  description: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "login",
    name: "Login Form",
    icon: LogIn,
    prompt: "A fancy but minimalistic login form landing page with a blurred glassmorphism background and soft animations.",
    description: "Modern authentication screen"
  },
  {
    id: "landing",
    name: "SaaS Landing",
    icon: Layout,
    prompt: "A high-converting SaaS landing page for a productivity tool, featuring a hero section with a product preview, features grid, and a pricing table.",
    description: "Business landing page"
  },
  {
    id: "portfolio",
    name: "Creative Portfolio",
    icon: User,
    prompt: "An elegant and bold portfolio page for a digital designer using large typography, minimal layout, and a masonry grid for projects.",
    description: "Showcase your work"
  },
  {
    id: "ecommerce",
    name: "E-commerce Product",
    icon: ShoppingBag,
    prompt: "A premium product detail page for a luxury watch brand, focusing on high-quality imagery, clean spacing, and an intuitive checkout flow.",
    description: "Product showcase"
  },
  {
    id: "newsletter",
    name: "Newsletter Signup",
    icon: Mail,
    prompt: "A clean and engaging newsletter subscription page with a clear value proposition and a simple input field.",
    description: "Grow your audience"
  }
];
