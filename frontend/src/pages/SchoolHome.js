import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { BookOpen, Users, Award, TrendingUp, GraduationCap, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

function SchoolHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-primary" />
              <h1 className="font-outfit text-xl md:text-2xl font-bold text-[#0F172A]">Veera Savarkar Netaji Matriculation School</h1>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-[#0F172A] hover:text-primary transition-colors font-medium">Home</a>
              <a href="#about" className="text-[#64748B] hover:text-primary transition-colors">About</a>
              <a href="#programs" className="text-[#64748B] hover:text-primary transition-colors">Programs</a>
              <a href="#facilities" className="text-[#64748B] hover:text-primary transition-colors">Facilities</a>
              <a href="#contact" className="text-[#64748B] hover:text-primary transition-colors">Contact</a>
              <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90" data-testid="portal-login-btn">
                Student Portal
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-20 bg-gradient-to-br from-[#EEF2FF] to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="font-outfit text-5xl md:text-6xl font-bold text-[#0F172A] mb-6 tracking-tight leading-tight">
                Empowering Minds,<br />Building Futures
              </h1>
              <p className="text-lg text-[#64748B] mb-8 leading-relaxed">
                Veera Savarkar Netaji Matriculation School is a premier educational institution in Chennai, dedicated to providing quality education through innovative teaching methods and comprehensive student development programs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90" data-testid="get-started-btn">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Access Portal
                </Button>
                <Button size="lg" variant="outline" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                  Get in Touch
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <img 
                src="https://customer-assets.emergentagent.com/job_resultpro/artifacts/woq7zb5q_WhatsApp%20Image%202026-02-23%20at%203.04.52%20PM.jpeg" 
                alt="Veera Savarkar Netaji Matriculation School Building" 
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="font-outfit text-5xl font-bold mb-2">2500+</p>
              <p className="text-blue-100">Active Students</p>
            </div>
            <div className="text-center">
              <p className="font-outfit text-5xl font-bold mb-2">150+</p>
              <p className="text-blue-100">Expert Teachers</p>
            </div>
            <div className="text-center">
              <p className="font-outfit text-5xl font-bold mb-2">98%</p>
              <p className="text-blue-100">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="font-outfit text-5xl font-bold mb-2">25+</p>
              <p className="text-blue-100">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-4xl font-bold text-[#0F172A] mb-4">About Excellence Academy</h2>
            <p className="text-lg text-[#64748B] max-w-3xl mx-auto">
              We are committed to providing quality education that prepares students for success in an ever-changing world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://images.pexels.com/photos/8465455/pexels-photo-8465455.jpeg" 
                alt="School building" 
                className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div>
              <h3 className="font-outfit text-3xl font-bold text-[#0F172A] mb-4">Our Mission</h3>
              <p className="text-[#64748B] mb-6 leading-relaxed">
                To nurture and develop the potential of every student through innovative teaching methods, comprehensive curriculum, and a supportive learning environment.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-outfit font-semibold text-[#0F172A] mb-1">Excellence in Education</h4>
                    <p className="text-sm text-[#64748B]">Highest standards of academic achievement and personal development</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-outfit font-semibold text-[#0F172A] mb-1">Holistic Development</h4>
                    <p className="text-sm text-[#64748B]">Focus on academics, sports, arts, and character building</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-outfit font-semibold text-[#0F172A] mb-1">Future Ready</h4>
                    <p className="text-sm text-[#64748B]">Preparing students for challenges of tomorrow with modern skills</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-4xl font-bold text-[#0F172A] mb-4">Our Programs</h2>
            <p className="text-lg text-[#64748B] max-w-3xl mx-auto">
              Comprehensive educational programs designed to meet diverse learning needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Primary Education',
                desc: 'Grades 1-5: Building strong foundations in core subjects with interactive learning',
                icon: BookOpen,
                color: 'primary'
              },
              {
                title: 'Middle School',
                desc: 'Grades 6-8: Comprehensive curriculum with focus on critical thinking and creativity',
                icon: Users,
                color: 'secondary'
              },
              {
                title: 'High School',
                desc: 'Grades 9-12: Advanced programs preparing students for higher education and careers',
                icon: GraduationCap,
                color: 'success'
              }
            ].map((program, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="card-hover border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] h-full">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-${program.color}/10 flex items-center justify-center mb-6`}>
                      <program.icon className={`w-8 h-8 text-${program.color}`} />
                    </div>
                    <h3 className="font-outfit text-2xl font-bold text-[#0F172A] mb-3">{program.title}</h3>
                    <p className="text-[#64748B] leading-relaxed">{program.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Online Exam System Feature */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-outfit text-4xl font-bold text-[#0F172A] mb-4">Digital Learning Platform</h2>
              <p className="text-lg text-[#64748B] mb-6 leading-relaxed">
                Access our state-of-the-art online examination and result management system. Take timed assessments, receive instant results, and download detailed performance reports.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-[#64748B]">Timed online examinations with auto-submit</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-[#64748B]">Instant automatic grading and results</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-[#64748B]">Downloadable PDF performance reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-[#64748B]">Secure role-based access for students and teachers</span>
                </div>
              </div>
              <Button size="lg" onClick={() => navigate('/login')} className="bg-secondary hover:bg-secondary/90">
                Access Exam Portal
              </Button>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg" 
                alt="Student using laptop" 
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-4xl font-bold text-[#0F172A] mb-4">World-Class Facilities</h2>
            <p className="text-lg text-[#64748B] max-w-3xl mx-auto">
              Modern infrastructure and resources to support comprehensive learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Smart Classrooms', desc: 'Interactive digital boards and modern teaching aids' },
              { title: 'Science Labs', desc: 'Fully equipped physics, chemistry, and biology laboratories' },
              { title: 'Sports Complex', desc: 'Indoor and outdoor sports facilities for all games' },
              { title: 'Library', desc: 'Extensive collection of books and digital resources' },
              { title: 'Computer Labs', desc: 'Latest technology and high-speed internet access' },
              { title: 'Auditorium', desc: 'State-of-the-art venue for events and programs' },
              { title: 'Art Studio', desc: 'Dedicated space for creative and artistic expression' },
              { title: 'Cafeteria', desc: 'Hygienic and nutritious meals in a comfortable setting' }
            ].map((facility, idx) => (
              <Card key={idx} className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <CardContent className="p-6">
                  <h3 className="font-outfit font-semibold text-[#0F172A] mb-2">{facility.title}</h3>
                  <p className="text-sm text-[#64748B]">{facility.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-outfit text-4xl font-bold text-[#0F172A] mb-4">Get in Touch</h2>
              <p className="text-[#64748B] mb-8">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-[#0F172A] mb-1">Address</h3>
                    <p className="text-[#64748B]">123 Education Street, Knowledge City, State 12345</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-[#0F172A] mb-1">Phone</h3>
                    <p className="text-[#64748B]">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-[#0F172A] mb-1">Email</h3>
                    <p className="text-[#64748B]">info@excellenceacademy.edu</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-[#0F172A] mb-1">Office Hours</h3>
                    <p className="text-[#64748B]">Monday - Friday: 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="font-outfit text-2xl font-bold text-[#0F172A] mb-6">Send us a Message</h3>
                <form className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Subject" 
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <textarea 
                      rows={4} 
                      placeholder="Your Message" 
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-6 h-6" />
                <h3 className="font-outfit text-xl font-bold">Excellence Academy</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering students to achieve excellence through quality education and holistic development.
              </p>
            </div>
            <div>
              <h4 className="font-outfit font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#programs" className="hover:text-white transition-colors">Programs</a></li>
                <li><a href="#facilities" className="hover:text-white transition-colors">Facilities</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-outfit font-semibold mb-4">Admissions</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How to Apply</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Admission Process</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fee Structure</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Scholarships</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-outfit font-semibold mb-4">Student Portal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a onClick={() => navigate('/login')} className="hover:text-white transition-colors cursor-pointer">Login</a></li>
                <li><a onClick={() => navigate('/login')} className="hover:text-white transition-colors cursor-pointer">Online Exams</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Results</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Announcements</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Excellence Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SchoolHome;
