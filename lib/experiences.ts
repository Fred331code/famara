
import { Wind, Waves, Snowflake } from "lucide-react";

export const EXPERIENCES = [
    {
        slug: "kite-surfing",
        title: "Kite Surfing",
        price: "110€",
        duration: "3 hr session",
        shortDescription: "Master the wind with our comprehensive kitesurfing lessons. Safe and rapid progression guaranteed.",
        longDescription: `
            Our kite surfing lessons are designed to get you riding the wind with confidence. 
            We believe that little changes make big differences in your technique. 
            Whether you are a complete beginner or looking to refine your jumps, our certified instructors provide personalized coaching.
            
            Key focus areas:
            - Safety and wind theory
            - Kite control and relaunch
            - Body dragging and water start
            - Riding technique and transitions
        `,
        // Replaced with a reliable Kitesurfing image (verified signed URL)
        image: "https://images.unsplash.com/photo-1564499504739-bc4fc2ae8cba?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        icon: Wind
    },
    {
        slug: "wing-foiling",
        title: "Wing Foiling",
        price: "100€",
        duration: "2 hr session",
        shortDescription: "Experience the newest sensation in water sports. Fast learning for beginners, advanced tips for riders.",
        longDescription: `
            Wing Foiling is the latest evolution in water sports, combining the freedom of a foil with the power of a handheld wing.
            It's accessible, safe, and incredibly fun.
            
            For Beginners: We use large, stable boards and wings to ensure you get the feeling of flight quickly.
            For Advanced: We focus on pumping, gybing, and tacking to keep you on the foil longer.
        `,
        // Replaced with a reliable Wing Foil image (verified signed URL)
        image: "https://images.unsplash.com/photo-1760506067710-c740a40c23ea?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        icon: Wind
    },
    {
        slug: "surfing-lessons",
        title: "Surfing Lessons",
        price: "75€",
        duration: "1 Day",
        shortDescription: "Structured lessons to start having fun in the surf immediately. Perfect for all levels.",
        longDescription: `
            Famara is arguably one of the best beach breaks in Europe for learning to surf.
            Our structured lessons help you understand the ocean, catch waves, and stand up with style.
            
            What's included:
            - Equipment rental (board & wetsuit)
            - Theory and safety briefing
            - Beach practice
            - In-water coaching
        `,
        image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop", // This one worked
        icon: Waves
    }
];
