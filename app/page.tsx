'use client'; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar'; // Assuming this exists


export default function HomePage() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen]);

    return (
        <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-900">
            <NavBar />

            {/* HERO SECTION: The "Flight Simulator" */}
            <header className="w-full pt-24 pb-20 md:pt-24 md:pb-24 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-100 to-blue-100">
                {/* Background: Subtle, abstract, high-end */}
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-slate-900 to-slate-900"></div>
                </div>

                <div className="relative z-10 max-w-4xl text-center px-6">
                    {/* Social Proof Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-900/10 bg-emerald-50 text-emerald-800 text-xs font-semibold tracking-wide uppercase mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                        Accepting 3 Design Partners for Q1
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif font-medium text-slate-900 mb-6 leading-[1.1] tracking-tight">
                        The Flight Simulator for <br />
                        <span className="text-emerald-900">Private Banking.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                        Practice complex UHNW conversations—estate planning, alternative investments, and fee defense—with an AI that thinks like your most sophisticated client.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-2">
                        <Link href="/sales-training" className="w-full md:w-auto bg-white hover:bg-slate-50 text-slate-700 font-medium py-4 px-8 rounded-lg shadow-sm border border-slate-200 text-lg transition-colors flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Try Free Demo
                        </Link>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-full md:w-auto bg-emerald-950 hover:bg-emerald-900 text-white font-medium py-4 px-8 rounded-sm shadow-xl shadow-emerald-900/10 text-lg transition-all transform-gpu hover:-translate-y-0.5"
                        >
                            Apply for Partner Program
                        </button>
                    </div>

                    <p className="mt-6 text-sm text-slate-500">
                        SOC2 Compliant Architecture • Private Cloud Deployable
                    </p>
                </div>
            </header>
{/* PARTNER APPLICATION MODAL */}
            {isModalOpen && (
                <PartnerApplicationModal onClose={() => setIsModalOpen(false)} />
            )}
            {/* TRUST BANNER: Highlighting Alumni immediately */}
            <section className="w-full border-y border-slate-200 bg-white py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        Engineering DNA from
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Replace specific widths with h-6 or h-8 to force uniform height */}
                        <Image src="/media/google.png" alt="Google" width={100} height={30} className="h-6 w-auto object-contain" />
                        <Image src="/media/su.png" alt="Stanford" width={100} height={30} className="h-6 w-auto object-contain" />
                        <Image src="/media/scale.webp" alt="Scale AI" width={100} height={30} className="h-5 w-auto object-contain" />
                        <Image src="/media/cu.png" alt="Columbia" width={100} height={30} className="h-6 w-auto object-contain" />
                    </div>
                </div>
            </section>

            {/* THE "TURING TEST" PROOF SECTION */}
            <section id="demo" className="w-full bg-slate-50 py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-sm font-bold text-emerald-700 tracking-wide uppercase mb-3">Unlike Generic Sales Tools</h2>
                            <h3 className="text-4xl font-serif text-slate-900 mb-6">Practice with financial nuance.</h3>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Generic LLMs apologize when you push back. Our models are calibrated on <strong>Stanford-developed</strong> frameworks and top-tier wealth management methodologies.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs">✓</div>
                                    <span className="text-slate-700">Understands <strong>Portfolio Liquidity</strong> constraints.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs">✓</div>
                                    <span className="text-slate-700">Detects subtle <strong>Trust Indicators</strong> vs. polite dismissals.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs">✓</div>
                                    <span className="text-slate-700">Simulates <strong>UHNW Personas</strong> (e.g., Tech Founder, Old Money Heir).</span>
                                </li>
                            </ul>
                        </div>

                        {/* Interactive Element Placeholder */}
                        <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-slate-100">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-emerald-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                Live Scenario
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">Rep</div>
                                    <div className="bg-slate-100 p-4 rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm text-slate-700">
                                        {`"We suggest diversifying into private credit to stabilize yield."`}
                                    </div>
                                </div>
                                <div className="flex gap-4 flex-row-reverse">
                                    <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-xs font-bold text-white">AI</div>
                                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-tl-xl rounded-bl-xl rounded-br-xl text-sm text-slate-800 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2 text-xs text-emerald-700 font-semibold uppercase">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            Audio Playing...
                                        </div>
                                        {`"I’m already heavily exposed to illiquids in my own business operations. Why would I lock up cash for another 7 years in this rate environment?"`}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-400 italic">Scenario: Defending Illiquidity Constraints</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUE PROP / "WHY NOW" */}
            <section className="w-full bg-white py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Risk-free practice for high-stakes outcomes.</h2>
                        <p className="text-lg text-slate-600">
                            {`Elite sellers shouldn't practice on your best clients. We combine cognitive science for optimized learning with the risk-mitigation of a flight simulator.`}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

{/* Feature 1: Instant Feedback */}
                    <div className="flex flex-col items-center">
                        <div className="w-40 h-40 relative mb-6 hover-scale-up transition-transform duration-300">
                            {/* Replace the placeholder div with Next/Image */}
                            <Image
                                src="/media/box.png"
                                alt="Instant Feedback Illustration"
                                fill
                                className="object-contain  "
                            />
                        </div>
                            <h3 className="text-xl font-bold mb-3">Instant Feedback</h3>
                        <p className="text-gray-700 text-center">Reps receive actionable feedback and scoring after every simulation, building confidence and skills at scale.</p>
                    </div>

                    {/* Feature 2: Personalized Coaching */}
                    <div className="flex flex-col items-center">
                        <div className="w-40 h-40 relative mb-6 hover-scale-up transition-transform duration-300">
                            <Image
                                src="/media/preseo.png"
                                alt="Personalized Coaching Illustration"
                                fill
                                className="object-contain "
                            />
                        </div>
                            <h3 className="text-xl font-bold mb-3">Personalized Coaching</h3>
                        <p className="text-gray-700 text-center">Managers deliver 1:1 coaching with rich post-practice insights, recommendations, and skill gap analysis.</p>
                    </div>

                    {/* Feature 3: Moneyball Readiness Score */}
                    <div className="flex flex-col items-center">
                        <div className="w-40 h-40 relative mb-6 hover-scale-up transition-transform duration-300">
                            <Image
                                src="/media/hands.png"
                                alt="Moneyball Readiness Score Illustration"
                                fill
                                className="object-contain "
                            />
                        </div>
                            <h3 className="text-xl font-bold mb-3">Moneyball Readiness Score</h3>
                        <p className="text-gray-700 text-center">Quantify rep readiness with scores based on objection handling, empathy, and closure rates. Move reps from onboarding to revenue in weeks, not months.</p>
                    </div> 
                    </div>
                </div>
            </section>

            {/* CTA SECTION: Exclusive */}
            <section className="w-full py-8 flex flex-col items-center bg-gradient-to-b from-slate-800 to-slate-900 text-white mt-auto">
                <div className="max-w-4xl mx-auto px-6 text-center py-10">
                    <h2 className="text-3xl md:text-4xl font-serif mb-6">Partner with us to define the standard.</h2>
                    <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
                        We are accepting applications for <strong>3 more Design Partners</strong> in Q1. Partners receive legacy pricing, custom scenario development, and white-glove onboarding.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link href="/sales-training/dashboard" className="bg-white text-emerald-950 font-semibold py-4 px-10 rounded-lg shadow-xl hover:bg-emerald-50 transition-colors">
                            Apply for Access
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="w-full py-8 flex flex-col items-center bg-slate-900 text-white mt-auto">

                <div className="max-w-6xl w-full px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="text-sm text-white/90 mb-2">
                            Looking for More Scenarios?{' '}
                            <Link href="/manager-training" className="text-white underline ">Managers</Link>{' or '}
                            <Link href="/interview-training" className="text-white underline ">MBA Interviews</Link>
                        </div>
                        <div className="text-xs text-white/60">© {new Date().getFullYear()} Surf Onboard AI. All rights reserved.</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/sales-training" className="text-white hover:text-emerald-400 text-sm underline">Sales Demo</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function PartnerApplicationModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep('success');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
            <div 
                className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200"
                onClick={(e) => e.stopPropagation()}
            >
                {step === 'form' ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-serif text-slate-900 mb-1">Request Access</h3>
                                <p className="text-sm text-slate-500">Design Partner Program • Q1 Cohort</p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">First Name</label>
                                    <input required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all" placeholder="Jane" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Last Name</label>
                                    <input required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Work Email</label>
                                <input required type="email" className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all" placeholder="jane@bankofamerica.com" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Institution / Firm</label>
                                <input required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all" placeholder="Global Wealth Management" />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                 <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Role</label>
                                    <select className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all bg-white">
                                        <option>Select...</option>
                                        <option>Head of Sales / Distribution</option>
                                        <option>L&D Director</option>
                                        <option>Regional Manager</option>
                                        <option>Relationship Manager</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Team Size</label>
                                    <select className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-emerald-900/20 focus:border-emerald-900 outline-none transition-all bg-white">
                                        <option>Select...</option>
                                        <option>1-10 Reps</option>
                                        <option>11-50 Reps</option>
                                        <option>50-250 Reps</option>
                                        <option>250+ Reps</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-emerald-950 text-white font-medium py-3 rounded-sm shadow-lg hover:bg-emerald-900 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-4">
                                    Your data is secure. We do not sell information to third parties.
                                </p>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-2xl font-serif text-slate-900 mb-2">Application Received</h3>
                        <p className="text-slate-600 mb-8 max-w-xs leading-relaxed">
                            Thank you for your interest. Our partnerships team reviews applications on a rolling basis. You will receive a status update within 3-5 business days.
                        </p>
                        <button 
                            onClick={onClose}
                            className="bg-white border border-slate-300 text-slate-700 font-medium py-2 px-6 rounded-sm hover:bg-slate-50 transition-colors uppercase tracking-wide text-xs"
                        >
                            Return to Homepage
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}