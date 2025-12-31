"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightIcon,
  SparklesIcon,
  BookOpenIcon,
  StarIcon,
  CheckCircleIcon,
} from "lucide-react";
import Footer from "./components/footer";
import Link from "next/link";
import Image from "next/image";
import { testimonials } from "./data/testimonial";
import { features } from "./data/feature";
import Header from "./components/header";
import { useInView } from "@/hooks/useInView";

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    // {
    //   image:
    //     "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    //   fact: "Students who use active recall techniques score 50% higher on tests than those who simply reread material.",
    // },
    {
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      fact: "Spaced repetition can improve long-term retention by up to 200% compared to traditional study methods.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
      fact: "Peer tutoring has been shown to benefit both the tutor and the student, improving understanding by 90%.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      fact: "AI-powered personalized learning can reduce study time by 40% while improving comprehension.",
    },
  ];

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { threshold: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Header heroInView={heroInView} />
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center bg-black justify-center overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Gray Flash Layer */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-gray-300 z-20"
            />

            {/* Dark overlay (the one you already had) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10" />

            {/* Background Image */}
            <Image
              src={heroSlides[currentSlide].image}
              alt="Students studying"
              className="w-full h-full object-cover"
              fill
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Elevate Your Learning
              <br />
              with AI
            </h1>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
            }}
          >
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100">
              Transform your study materials into personalized quizzes, connect
              with peers, and track your progress with intelligent analytics.
            </p>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.6,
            }}
            className="mb-12"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors shadow-xl"
            >
              Start Learning Now
              <ArrowRightIcon size={20} className="ml-2" />
            </Link>
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.5,
              }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-2xl mx-auto"
            >
              <div className="flex items-start space-x-3">
                <SparklesIcon size={24} className="flex-shrink-0 mt-1" />
                <p className="text-lg text-left">
                  {heroSlides[currentSlide].fact}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Slide indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? "bg-white w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Mission & Vision Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                To democratize education by leveraging artificial intelligence
                and collaborative learning, making high-quality study tools
                accessible to every student, everywhere.
              </p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <BookOpenIcon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We envision a world where every student has access to
                personalized, AI-powered learning tools that adapt to their
                unique needs, helping them achieve their full academic
                potential.
              </p>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="bg-green-100 text-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <CheckCircleIcon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Values
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Innovation, accessibility, and student success drive everything
                we do. We believe in the power of technology to transform
                education and create equal opportunities for all learners.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to excel in your studies, all in one
                intelligent platform.
              </p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow"
              >
                <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                What Students Say
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of students who have transformed their learning
                experience.
              </p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      size={18}
                      className="text-amber-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    width={48}
                    height={48}
                  />
                  <div>
                    <div className="font-bold text-gray-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already studying smarter, not
              harder.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors shadow-xl"
            >
              Get Started for Free
              <ArrowRightIcon size={20} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};
export default LandingPage;
