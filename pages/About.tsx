
import React from 'react';

const TeamMember: React.FC<{ name: string; role: string; image: string; bio?: string }> = ({ name, role, image, bio }) => (
    <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center group">
        <div className="relative mb-5">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-secondary/40 transition-all duration-300 shadow-md">
                <img 
                    src={image} 
                    alt={name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    loading="lazy" 
                />
            </div>
            <span className="absolute bottom-0 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" title="Active Leadership"></span>
        </div>
        <h4 className="text-lg font-bold font-montserrat text-gray-800 tracking-tight">{name}</h4>
        <span className="inline-block mt-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
            {role}
        </span>
        {bio && (
            <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                {bio}
            </p>
        )}
    </div>
);

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold font-poppins text-primary mb-2">{question}</h4>
        <p className="text-gray-700 leading-relaxed">{answer}</p>
    </div>
);

const About: React.FC = () => {
    const faqs = [
        {
            question: "How do I book a package?",
            answer: "Booking with Global Connect is easy! Simply browse our packages, choose the one that suits you, and click on 'View Details'. On the package details page, you'll find a booking form. Fill it out, and you'll be guided to our secure payment page to complete your reservation."
        },
        {
            question: "What is included in the package price?",
            answer: "Each package is different, but typically our prices include accommodation, specified meals, guided tours, and transportation as mentioned in the itinerary. Please check the 'Highlights' and 'Itinerary' sections on the package details page for specific inclusions. International flights are usually not included unless specified."
        },
        {
            question: "Can I customize a tour package?",
            answer: "Absolutely! We understand that every traveler is unique. If you'd like to customize a package, please get in touch with us through our Contact Us page. Our travel experts will be happy to create a personalized itinerary that matches your interests and budget."
        },
        {
            question: "What is your cancellation policy?",
            answer: "Our cancellation policy varies depending on the package and the time of cancellation. Generally, you can find detailed information about the cancellation terms and conditions when you are booking. For specific queries, please contact our support team."
        },
        {
            question: "Do I need travel insurance?",
            answer: "We highly recommend that all our travelers purchase comprehensive travel insurance before their trip. Insurance provides peace of mind and covers unforeseen events such as medical emergencies, trip cancellations, or lost baggage. It is not included in our packages but we can assist you in finding a suitable provider."
        }
    ];

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-montserrat text-primary">About Global Connect</h1>
                    <p className="mt-4 text-lg text-gray-600">Crafting unforgettable journeys since 2010.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img src="https://picsum.photos/seed/aboutus/800/600.webp" alt="Travelers enjoying a view" className="rounded-lg shadow-xl" loading="lazy" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-semibold font-poppins text-gray-800">Our Story</h2>
                        <p className="mt-4 text-gray-700 leading-relaxed">
                            Global Connect was founded with a simple mission: to make extraordinary travel accessible to everyone. We believe that travel is more than just seeing new places; it's about creating lasting memories, forging new connections, and broadening one's perspective on the world.
                        </p>
                        <p className="mt-4 text-gray-700 leading-relaxed">
                            With over a decade of experience, our team of passionate travel experts meticulously plans each itinerary to ensure a seamless, authentic, and enriching experience for our clients.
                        </p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                     <h2 className="text-3xl font-semibold font-poppins text-gray-800">Our Vision & Mission</h2>
                     <div className="mt-8 grid md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold font-montserrat text-secondary">Our Vision</h3>
                            <p className="mt-4 text-gray-700">To be the most trusted and innovative travel agency, inspiring people to explore the world with curiosity and respect.</p>
                        </div>
                         <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold font-montserrat text-secondary">Our Mission</h3>
                            <p className="mt-4 text-gray-700">To provide exceptional, personalized travel services that exceed our clients' expectations, while promoting sustainable and responsible tourism.</p>
                        </div>
                     </div>
                </div>
                
                <div className="mt-16">
                    <h2 className="text-3xl font-semibold text-center font-poppins text-gray-800">Meet Our Team</h2>
                    <p className="text-center text-gray-600 mt-2">The passionate professionals behind your perfect vacation.</p>
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <TeamMember 
                            name="Abhishek Yadav" 
                            role="Founder and CEO" 
                            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80" 
                            bio="Spearheading Global Connect's vision, global travel partnerships, and transformative holiday experiences."
                        />
                        <TeamMember 
                            name="Manish Yadav" 
                            role="Co Founder and Head of Operations" 
                            image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80" 
                            bio="Overseeing worldwide ground logistics, trusted hotel networks, and seamless on-trip execution."
                        />
                        <TeamMember 
                            name="Gautam Gopal" 
                            role="Lead Travel Consultant" 
                            image="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&h=400&q=80" 
                            bio="Crafting tailored itineraries and providing in-depth destination guidance for all travel styles."
                        />
                        <TeamMember 
                            name="Ashutosh Kumar Yadav" 
                            role="Marketing Director" 
                            image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80" 
                            bio="Championing brand storytelling, traveler community engagement, and digital outreach across channels."
                        />
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-3xl font-semibold text-center font-poppins text-gray-800">Frequently Asked Questions</h2>
                    <p className="text-center text-gray-600 mt-2">Answers to common questions about our services.</p>
                    <div className="mt-10 max-w-4xl mx-auto space-y-6">
                        {faqs.map((faq, index) => (
                            <FaqItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;