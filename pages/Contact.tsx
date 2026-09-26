
import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        setSubmitted(true);
        // Reset form after a few seconds
        setTimeout(() => {
            setFormData({ name: '', email: '', subject: '', message: '' });
            setSubmitted(false);
        }, 5000);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {submitted && <div className="p-4 bg-green-100 text-green-800 rounded-md">Thank you for your message! We will get back to you shortly.</div>}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
            </div>
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea name="message" id="message" rows={4} required value={formData.message} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
            </div>
            <div>
                <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    Send Message
                </button>
            </div>
        </form>
    );
};


const Contact: React.FC = () => {
    return (
        <div className="py-12 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-montserrat text-primary">Contact Us</h1>
                    <p className="mt-4 text-lg text-gray-600">We'd love to hear from you. Get in touch with us for any inquiries.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-6">Send us a message</h2>
                        <ContactForm />
                    </div>
                    <div className="space-y-8">
                         <div>
                            <h3 className="text-xl font-semibold font-poppins text-secondary">Our Office</h3>
                            <p className="mt-2 text-gray-700">123 Travel Lane, Wanderlust City, 98765</p>
                        </div>
                         <div>
                            <h3 className="text-xl font-semibold font-poppins text-secondary">Email Us</h3>
                            <p className="mt-2 text-gray-700">info@globalconnect.travel</p>
                        </div>
                         <div>
                            <h3 className="text-xl font-semibold font-poppins text-secondary">Call Us</h3>
                            <p className="mt-2 text-gray-700">(123) 456-7890</p>
                        </div>
                        <div className="h-64 md:h-80 w-full rounded-lg shadow-md overflow-hidden">
                             <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086318536551!2d-122.41941568468153!3d37.77492957975871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c1b8f1c83%3A0x29b2c365a32b1d34!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1618952402921!5m2!1sen!2sus" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={true} 
                                loading="lazy"
                                title="Office Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
