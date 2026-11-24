/*
 * Single source of truth for every project.
 * Used by the Projects section on index.html (projects-section.js)
 * and by the detail page project.html (project.js).
 *
 * Card-only fields (ignored by project.js):
 *   category  - 'web' | 'desktop' | 'game' | 'video' | 'design'
 *   summary   - short text shown on the card (description is used in the modal/detail page)
 *   featured  - true makes the card span two columns in the grid
 *   cover     - image used on the card (defaults to the first image)
 *   fit       - 'contain' keeps posters/logos uncropped on the card
 *   preview   - true plays a muted video preview when the card is hovered
 *   hidden    - true keeps the project out of the Projects section (detail page still works)
 */
window.PORTFOLIO_PROJECTS = {
    "ppt-game-bsit": {
        title: "PPT Game BSIT",
        subtitle: "Interactive PowerPoint Game",
        year: "1st Year",
        category: "game",
        fit: "contain",
        summary:
            "An interactive PowerPoint game with clickable hyperlinks, slide navigation, and game mechanics built entirely in PowerPoint.",
        description:
            "An interactive PowerPoint game project for BSIT 1st year. Built with Microsoft PowerPoint featuring clickable hyperlinks, slide-to-slide navigation, and interactive game elements. Open the presentation to play — all hyperlinks are fully functional in slideshow mode.",
        tags: ["PowerPoint", "Microsoft Office", "Presentation"],
        ppt: "files/ppt-game-bsit.pptx",
        pdf: "files/ppt-game-bsit.pdf",
        images: [{ src: "images/projects/ppt-game-slide1.png", label: "Slide 1" }],
    },
    "travel-booking": {
        title: "Fly Ninja Tours",
        subtitle: "Travel Booking System",
        year: "1st Year",
        category: "desktop",
        summary:
            "A Python desktop app for booking flights: log in, fill passenger and route details, pick dates, and manage bookings.",
        description:
            "A travel booking system originally built with Python Tkinter for Fly Ninja Tours. Login, fill passenger and route details, pick departure and arrival dates, then create, update, or delete bookings. Try the interactive web version below — same flow as the desktop app.",
        tags: ["Python", "Tkinter", "CSV", "JavaScript"],
        gameEmbed: "games/travel-booking/index.html?v=7",
        embedNote: "Open the app below. Login with admin / 1234, book a flight, and manage records in the table.",
        embedTitle: "Fly Ninja Tours",
        embedHeight: "700px",
        images: [
            { src: "images/projects/travel-booking-login.png?v=7", label: "Login Screen" },
            { src: "images/projects/travel-booking-form.png?v=4", label: "Booking Desk" },
        ],
    },
    "personal-portfolio": {
        title: "Personal Portfolio",
        subtitle: "My First Website",
        year: "1st Year",
        category: "web",
        hidden: true,
        description:
            "My first website built with HTML and CSS. This project helped me learn the fundamentals of web structure, styling, and responsive layout.",
        tags: ["HTML", "CSS"],
        github: "https://github.com/yourusername/personal-portfolio",
        images: [],
    },
    "landing-page": {
        title: "Landing Page",
        subtitle: "School Activity Project",
        year: "1st Year",
        category: "web",
        hidden: true,
        description:
            "A simple responsive landing page created for a school activity. Focused on clean design, layout sections, and mobile-friendly styling.",
        tags: ["HTML", "CSS"],
        github: "https://github.com/yourusername/landing-page",
        images: [],
    },
    "kicks-pos": {
        title: "KICK POS",
        subtitle: "Shoe Store Point of Sale System",
        year: "2nd Year",
        category: "desktop",
        summary:
            "A Java desktop POS for a shoe store. Browse by category, pick size and quantity, process orders, and print receipts.",
        description:
            "A Java desktop POS application for a shoe store called KICKS. Features product browsing by category (All, Women, Men, Kids), order details with shoe size and quantity selection, customer information input, payment processing, and automated receipt generation with shipping details.",
        tags: ["Java", "Java Swing", "GUI"],
        github: "https://github.com/yourusername/kicks-pos",
        images: [
            { src: "images/projects/kicks-pos-main.png", label: "Product Catalog" },
            { src: "images/projects/kicks-pos-order.png", label: "Order Details" },
            { src: "images/projects/kicks-pos-receipt.png", label: "Receipt" },
        ],
    },
    "todo-app": {
        title: "To-Do App",
        subtitle: "Task Manager",
        year: "2nd Year",
        category: "web",
        hidden: true,
        description:
            "A task manager built with JavaScript. Users can add, complete, and delete tasks with data stored in the browser.",
        tags: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/yourusername/todo-app",
        images: [],
    },
    calculator: {
        title: "Calculator",
        subtitle: "JavaScript Project",
        year: "2nd Year",
        category: "web",
        hidden: true,
        description:
            "A basic calculator with JavaScript functions. Supports standard arithmetic operations with a simple and clean interface.",
        tags: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/yourusername/calculator",
        images: [],
    },
    "food-dispenser": {
        title: "Paws & Play",
        subtitle: "Smart Pet Daycare & Food Dispenser",
        year: "3rd Year",
        category: "web",
        summary:
            "A pet daycare platform wired to an Arduino food dispenser: bookings, staff and admin dashboards, feeding schedules, and real-time dispense status.",
        description:
            "A smart pet daycare system built with CodeIgniter 4 and MySQL, connected to an Arduino automatic food dispenser. Customers can book daycare, browse pets and products, and manage orders. Staff handle bookings, cages, feeding schedules, and dispenser status, while admins manage users, pets, products, payments, and analytics. The Arduino API receives feeding commands and reports dispense results in real time. Developed by Jun Alexes Orao and Guian Carlos M. Buhawe.",
        tags: ["CodeIgniter", "PHP", "MySQL", "Arduino", "HTML", "CSS", "JavaScript"],
        github: "https://github.com/tabudi25/paws_and_play.git",
        images: [
            { src: "images/projects/food-dispenser-landing.png", label: "Landing" },
            { src: "images/projects/food-dispenser-login.png", label: "Login" },
        ],
    },
    "instructor-eval": {
        title: "InstructorEval",
        subtitle: "Instructor Evaluation System",
        year: "3rd Year",
        category: "web",
        summary:
            "Students evaluate instructors to improve teaching quality. Auth, admin dashboard, teacher and subject management, evaluation settings.",
        description:
            "A web platform where students can evaluate instructors and help improve teaching quality. Includes user authentication, admin dashboard, teacher management, subject management, and evaluation settings.",
        tags: ["Laravel", "PHP", "HTML", "CSS", "JavaScript"],
        github: "https://github.com/tabudi25/instructor_eval_system",
        images: [
            { src: "images/projects/instructor-home.png", label: "Home Page" },
            { src: "images/projects/instructor-login.png", label: "Login Page" },
            { src: "images/projects/instructor-dashboard.png", label: "Admin Dashboard" },
        ],
    },
    "flip-memory": {
        title: "Flip Memory Game",
        subtitle: "Multi-Theme Anime Memory Game",
        year: "3rd Year",
        category: "game",
        summary:
            "A memory game with 5 anime themes, multiple grid sizes, timers, score tracking, and themed music. Playable right here in the browser.",
        description:
            "An interactive flip-card memory game built with Python (Tkinter & CustomTkinter) featuring 5 anime themes — Naruto, One Piece, Slam Dunk, Dragon Ball, and Bleach. Includes multiple grid sizes (4×4, 6×6, 8×8), score tracking, flip limits, timers, themed music, and a leaderboard. Play the web version directly below — ported from the original desktop app. Developed by Jun Alexes Orao and Guian Carlos M. Buhawe.",
        tags: ["Python", "Tkinter", "CustomTkinter", "HTML", "CSS", "JavaScript"],
        github: "https://github.com/tabudi25/App_Dev",
        gameEmbed: "games/flip-memory/index.html",
        images: [
            { src: "images/projects/flip-memory-home.png", label: "Home Screen" },
            { src: "images/projects/flip-memory-themes.png", label: "Theme Selection" },
            { src: "images/projects/flip-memory-gameplay.png", label: "Gameplay" },
        ],
    },
    "movie-trailer": {
        title: "Room 402",
        subtitle: "Movie Trailer",
        year: "3rd Year",
        category: "video",
        cover: "images/projects/room-401-cover.jpg",
        preview: true,
        summary:
            "A cinematic trailer cut with transitions, effects, and sound design to build excitement for the film.",
        description:
            "A cinematic movie trailer for Room 402, featuring scene cuts, transitions, sound design, and visual storytelling to build excitement for the film. Starring Lara Galarpe, Jun Alexes Orao, Renier Rivas, Luther Malolot, Mark Señora, Juliana Jadman, Mc Ameril Sarip, Kevin Agbu, John Client Acebu, and Teresito Pacardo.",
        tags: ["Video Editing", "Adobe Premiere", "After Effects"],
        github: "https://github.com/yourusername/movie-trailer",
        video: "videos/room-401.mp4",
        images: [],
    },
    "movie1-poster": {
        title: "Movie1 Poster",
        subtitle: "Room 402 Group Poster",
        year: "3rd Year",
        category: "design",
        fit: "contain",
        summary: "A composite poster for Room 402 with cast collage, title treatment, and crew credits.",
        description:
            "A composite movie poster for Room 402 featuring the cast collage, title treatment, and crew credits. Designed as part of the short film project’s visual identity. Cast: Lara Galarpe, Jun Alexes Orao, Renier Rivas, Luther Malolot, Mark Señora, Juliana Jadman, Mc Ameril Sarip, Kevin Agbu, John Client Acebu, and Teresito Pacardo.",
        tags: ["Photoshop", "Poster Design", "Graphic Design"],
        images: [{ src: "images/projects/movie1-poster.png", label: "Poster" }],
    },
    "movie2-trailer": {
        title: "Movie 2 Trailer",
        subtitle: "Cinematic Trailer Edit",
        year: "3rd Year",
        category: "video",
        cover: "images/projects/movie2-trailer-cover.jpg",
        preview: true,
        summary: "A second trailer with tighter pacing, color grading, and effects for a polished preview.",
        description:
            "A second movie trailer with improved pacing, color grading, and effects. Focused on creating a polished and engaging preview for the film. Directed by Kesey G. Decierdo. Starring Metch, Mc Ameril, Jun Alexes, Xyron, Hanifa, Vincent Art, Sam Daniel, Stephen, Kenn Mark, and Derek John.",
        tags: ["Video Editing", "Adobe Premiere", "Color Grading"],
        video: "videos/movie2-trailer.mp4",
        images: [
            { src: "images/projects/movie2-trailer-1.jpg", label: "Scene 1" },
            { src: "images/projects/movie2-trailer-2.jpg", label: "Scene 2" },
            { src: "images/projects/movie2-trailer-3.jpg", label: "Scene 3" },
        ],
    },
    "almost-you": {
        title: "Almost You",
        subtitle: "Full Movie — Final Export",
        year: "3rd Year",
        category: "video",
        summary:
            "A complete short film from planning to final export: filming, editing, audio mixing, and visual storytelling.",
        description:
            "A complete short film from planning to final export. Includes filming, editing, audio mixing, and visual storytelling across the full runtime. Directed by Kesey G. Decierdo. Starring Metch, Mc Ameril, Jun Alexes, Xyron, Hanifa, Vincent Art, Sam Daniel, Stephen, Kenn Mark, and Derek John.",
        tags: ["Video Production", "Editing", "Storytelling"],
        video: "videos/almost-you.mp4",
        images: [
            { src: "images/projects/almost-you-cover.jpg", label: "Cover" },
            { src: "images/projects/almost-you-1.jpg", label: "Scene 1" },
            { src: "images/projects/almost-you-2.jpg", label: "Scene 2" },
            { src: "images/projects/almost-you-3.jpg", label: "Scene 3" },
        ],
    },
    "almost-you-poster": {
        title: "Almost You Poster",
        subtitle: "Movie Poster",
        year: "3rd Year",
        category: "design",
        fit: "contain",
        summary: "A rom-com movie poster for Almost You with a cast collage, script title lettering, and split city backdrop.",
        description:
            "The official movie poster for the short film Almost You. It combines a cast collage, script title lettering, and a split blue-and-pink city backdrop that matches the film's romantic comedy tone. Directed by Kesey G. Decierdo. Cast: Metch, Mc Ameril, Jun Alexes, Xyron, Hanifa, Vincent Art, Sam Daniel, Stephen, Kenn Mark, and Derek John.",
        tags: ["Photoshop", "Poster Design", "Graphic Design"],
        images: [{ src: "images/projects/almost-you-poster.jpg", label: "Poster" }],
    },
    movie: {
        title: "Visual Story",
        subtitle: "Full Video Production",
        year: "3rd Year",
        category: "video",
        preview: true,
        summary:
            "A full movie project showing production and post-production: filming, editing, audio mixing, storytelling.",
        description:
            "A complete movie project from planning to final export. Includes filming, editing, audio mixing, and post-production.",
        tags: ["Video Production", "Editing", "Storytelling"],
        github: "https://github.com/yourusername/movie",
        video: "videos/visual-story.mp4?v=2",
        images: [
            { src: "images/projects/visual-story-1.jpg", label: "Scene 1" },
            { src: "images/projects/visual-story-2.jpg", label: "Scene 2" },
            { src: "images/projects/visual-story-3.jpg", label: "Scene 3" },
        ],
    },
    "personal-logo": {
        title: "Personal Logo",
        subtitle: "JAO Brand Mark",
        year: "3rd Year",
        category: "design",
        fit: "contain",
        summary: "A personal brand mark combining custom 3D typography with photography.",
        description:
            "A personal logo design that blends custom 3D typography with photography to create a distinctive JAO brand mark for personal identity and portfolio use.",
        tags: ["Photoshop", "Logo Design", "Branding"],
        images: [{ src: "images/projects/personal-logo.png", label: "Logo" }],
    },
    "orao-clan-logo": {
        title: "Orao Clan Logo",
        subtitle: "Camiguin Clan Emblem",
        year: "3rd Year",
        category: "design",
        fit: "contain",
        summary: "A circular clan emblem with mountain and palm silhouettes, a sunset sky, and 3D lettering.",
        description:
            "A circular clan emblem with mountain and palm silhouettes against a sunset sky, 3D “ORAO CLAN” lettering, and a Camiguin banner — designed for group identity and branding.",
        tags: ["Photoshop", "Logo Design", "Illustration"],
        images: [{ src: "images/projects/orao-clan-logo.png", label: "Logo" }],
    },
    "certificate-activity": {
        title: "Certificate Activity",
        subtitle: "Best Actor — Room 402",
        year: "3rd Year",
        category: "design",
        fit: "contain",
        summary:
            "A cinematic certificate design for Best Actor, part of Room 402’s Best Short Film win at the MMFF activity.",
        description:
            "A cinematic certificate of achievement design presented for Best Actor, recognizing Room 402’s Best Short Film (Main Category) award at the MMFF activity.",
        tags: ["Photoshop", "Certificate Design", "Graphic Design"],
        images: [{ src: "images/projects/certificate-activity.png", label: "Certificate" }],
    },
    "creative-ads": {
        title: "Creative Ads",
        subtitle: "Advertisement Video",
        year: "3rd Year",
        category: "video",
        summary:
            "Advertisement videos that promote products with motion graphics, punchy visuals, and clear messaging.",
        description:
            "Creative advertisement videos designed to promote products and brands. Combines motion graphics, catchy visuals, and clear messaging. Featuring Lara Galarpe, Jun Alexes Orao, Renier Rivas, Luther Malolot, Mark Señora, Juliana Jadman, Mc Ameril Sarip, Kevin Agbu, John Client Acebu, and Teresito Pacardo.",
        tags: ["Video Ads", "Motion Graphics", "Creative Design"],
        video: "videos/creative-ads.mov",
        images: [],
    },
    tripwise: {
        title: "TripWise",
        subtitle: "Nationwide Travel Package Booking Platform",
        year: "4th Year",
        category: "web",
        summary:
            "Travelers compare packages from verified PH agencies, book and pay online, and track trips. Agencies get a workspace with AI-assisted listings.",
        description:
            "A technology startup project for travel in the Philippines. Travelers browse tour packages from verified local agencies, compare destinations, day-by-day itineraries, and departure dates, then reserve and pay online in one place. After booking, the My Trips page tracks upcoming, ongoing, completed, and cancelled trips with documents, announcements, and reviews. Agencies get a workspace to manage packages (create manually or with AI), bookings, payments, trips, documents, and reports. Includes an AI Trip Planner and role-based access for travelers, agencies, and admins.",
        tags: ["Ionic React", "React", "PHP", "MySQL", "OpenAI", "Capacitor"],
        images: [
            { src: "images/projects/tripwise-landing.png", label: "Landing Page" },
            { src: "images/projects/tripwise-login.png", label: "Sign In" },
            { src: "images/projects/tripwise-agency-packages.png", label: "Agency Workspace — Packages" },
            { src: "images/projects/tripwise-my-trips.png", label: "My Trips" },
        ],
    },
    "hotel-management-system": {
        title: "SPC Hotel",
        subtitle: "Hotel Management System: A Web-Based Simulation Platform for Hospitality Students",
        year: "4th Year",
        category: "web",
        summary:
            "Capstone. Hospitality students design a hotel, customize its website, then run Front Desk, Rooms, Restaurant, Housekeeping, and Maintenance in simulation.",
        description:
            "Our capstone project for Southern de Oro Philippines College. SPC Hotel is a web-based simulation platform where Hospitality Management students design a hotel concept, customize their own hotel website from a template, and then run it across six departments: Front Desk, Room Management, Restaurant Services, Housekeeping, Maintenance, and Reports & Analytics. Faculty create teams, assign page roles and simulation tasks, approve hotel concepts, and monitor progress, while the Dean oversees users, teams, and reports. Includes activity logs, task notifications, and bulk student upload. Developed by Jun Alexes Orao and Xyron Sandigan.",
        tags: ["Laravel", "PHP", "Tailwind CSS", "JavaScript", "HTML", "Supabase"],
        live: "https://hms-9ojw.onrender.com/",
        images: [
            { src: "images/projects/hms-faculty-dashboard.png", label: "Faculty Dashboard" },
            { src: "images/projects/hms-hotel-concept.png", label: "Hotel Concept Review" },
            { src: "images/projects/hms-student-tasks.png", label: "Student Tasks" },
        ],
    },
};
