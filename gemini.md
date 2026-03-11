# Project Context: The Assembly

## 1. Project Overview
"The Assembly" is a premium, highly animated e-commerce frontend for PC components. It functions as a boutique hardware store where users can select parts to build a PC and proceed to a functional checkout. The design aesthetic should be minimalist, dark-themed, and rely heavily on smooth layout animations.

## 2. Tech Stack Requirements
* Framework: Next.js (App Router)
* Styling: Tailwind CSS
* Animations: Framer Motion (Crucial for page transitions and component reveals)
* Authentication: NextAuth or Supabase Auth (Must support Email Verification)
* Database: MongoDB or Supabase (To store Users, Products, and Orders)
* Payments: Stripe Checkout (Test Mode)
* State Management: Zustand or React Context (Crucial for managing the Cart for both logged-in and guest users)

## 3. Core User Flow & Pages

### Route: `/` (Landing Page)
* Visuals: High-end hero section with Framer Motion entry animations.
* Authentication: A login/signup modal or dedicated section requiring email verification.
* Action 1: "Login & Build" (Saves cart and order history to the database).
* Action 2: "Direct Build" (Guest mode. Bypasses login. Cart state is saved locally in the browser, but progress is not saved to a database).

### Route: `/build` (The Configurator)
* Layout: The core interface must display exactly 7 category icons:
  1. Motherboard
  2. Processor
  3. RAM
  4. CPU Cooler
  5. GPU
  6. Power Supply
  7. Case
* Interaction: Clicking an icon reveals a list/grid of available products for that specific category. Users can click "Add to Cart" on a product.
* Cart UI: A floating or sticky cart summary showing selected parts and the calculated total price.
* Checkout: A prominent "Checkout" button at the bottom of the page or inside the cart summary.

### Action: Payment Gateway
* When the user clicks "Checkout", the application must generate a Stripe Checkout session.
* Redirect the user to the Stripe hosted payment page.
* Upon successful payment, clear the local cart state and redirect to a `/success` page.

## 4. Developer Instructions for AI Agent
* Seed Data: Please generate a script to seed the database with 3-4 dummy products for each of the 7 categories so the UI can be tested immediately.
* Component Architecture: Build modular, reusable UI components. Separate the business logic (cart state, fetching products) from the UI components.
* Animations First: Wrap layout shifts (like opening a category to see products) in Framer Motion `<AnimatePresence>` tags for smooth mounting/unmounting.