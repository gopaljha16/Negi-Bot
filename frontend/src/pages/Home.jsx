import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Zap,
  Shield,
  Brain,
  Star,
  ArrowRight,
  Play,
  Users,
  Award,
  Sparkles,
  Bot,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Advanced AI Intelligence",
      description:
        "Powered by cutting-edge machine learning algorithms for intelligent conversations and problem-solving capabilities.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Responses",
      description:
        "Get instant answers with sub-second response times. No more waiting for AI to process your requests.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description:
        "Military-grade encryption ensures your data stays secure with end-to-end protection and privacy.",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Personalized Experience",
      description:
        "Adapts to your communication style and preferences for a truly customized AI assistant experience.",
    },
  ];

  const testimonials = [
    {
      name: "Shrey Goel",
      role: "Product Manager at TechCorp",
      content:
        "NegiBot has revolutionized how our team communicates. It's like having a genius assistant available 24/7. The intelligence and responsiveness are unmatched.",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Gopal Jha",
      role: "Software Engineer",
      content:
        "The most intuitive AI I've ever used. Rohit Negi's creation is truly remarkable - it understands context better than any other AI assistant.",
      rating: 5,
      avatar: "AC",
    },
    {
      name: "Maya Patel",
      role: "UX Designer",
      content:
        "Beautiful interface, incredible intelligence. This is definitely the future of AI assistants. The user experience is absolutely seamless.",
      rating: 5,
      avatar: "MP",
    },
  ];

  const stats = [
    {
      number: "1M+",
      label: "Active Users",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "99.9%",
      label: "Uptime Guarantee",
      icon: <Award className="w-6 h-6" />,
    },
    {
      number: "50ms",
      label: "Avg Response Time",
      icon: <Zap className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div
          className={`text-center max-w-5xl mx-auto transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Introducing the Future of AI Assistance
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Meet </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              NegiBot
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed px-4">
            Experience the next generation of AI assistance. Built by{" "}
            <span className="text-purple-400 font-semibold">Rohit Negi</span>,
            NegiBot delivers intelligent conversations that understand, learn,
            and adapt to your unique needs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4">
            <NavLink to="/chat">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 group">
                <Play className="w-5 h-5 mr-2 inline group-hover:scale-125 transition-transform" />
                Start Chatting Now
                <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </button>
            </NavLink>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 hover:scale-105 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="text-purple-400 mr-3">{stat.icon}</div>
                  <div className="text-3xl font-bold text-purple-300">
                    {stat.number}
                  </div>
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-purple-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover what makes NegiBot the most advanced and intelligent AI
              assistant platform in the world
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 lg:p-8 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              What People Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Trusted by thousands of professionals and organizations worldwide
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 lg:p-8 hover:bg-white/10 hover:scale-105 transition-all duration-300"
              >
                {/* Rating */}
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-lg border-t border-purple-500/20 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  NegiBot
                </span>
              
              </div>
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-center lg:text-right">
              <p className="text-lg">© 2025 NegiBot. All rights reserved.</p>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
