import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { GraduationCap, ArrowLeft, Award, Heart, Target } from 'lucide-react';
import { motion } from 'framer-motion';

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-[#E2E8F0]"></div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                <h1 className="font-outfit text-xl font-bold text-[#0F172A]">About Us</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-outfit text-5xl font-bold text-[#0F172A] mb-4 tracking-tight">
            Our Legacy
          </h1>
          <p className="text-lg text-[#64748B] max-w-3xl mx-auto">
            A journey of dedication, sacrifice, and unwavering commitment to education since 1961
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="relative">
                <img 
                  src="https://customer-assets.emergentagent.com/job_resultpro/artifacts/uh8jagjg_WhatsApp%20Image%202026-02-23%20at%203.50.06%20PM%20%281%29.jpeg"
                  alt="Shri P. Venugopalan - Founder"
                  className="rounded-3xl shadow-2xl w-full h-[600px] object-cover object-center"
                  style={{ objectPosition: 'center 20%' }}
                />
                <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-2xl shadow-xl">
                  <p className="font-outfit text-3xl font-bold">1911 - 1976</p>
                  <p className="text-sm">Founder & Visionary</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-10 h-10 text-primary" />
                <div>
                  <h2 className="font-outfit text-4xl font-bold text-[#0F172A]">Shri P. Venugopalan</h2>
                  <p className="text-[#64748B] text-lg">Founder | Freedom Fighter | Visionary Educationist</p>
                </div>
              </div>

              <div className="space-y-4 text-[#64748B] leading-relaxed">
                <p>
                  Shri P. Venugopalan was a distinguished freedom fighter and a visionary who dedicated his life to the upliftment of society through education. He firmly believed that <strong className="text-[#0F172A]">education is the most powerful weapon to eliminate ignorance, poverty, and social inequality.</strong>
                </p>

                <p>
                  During the early years after India's independence, he recognized that many communities lacked access to quality education. With determination and patriotic spirit, he established educational institutions in <strong className="text-[#0F172A]">Agaram, Lakshmipuram, Perambur, and Vyasarpadi,</strong> creating opportunities for thousands of children from underprivileged backgrounds.
                </p>

                <p>
                  Despite severe infrastructural challenges, including flooded roads and lack of facilities, his passion inspired teachers and students alike to continue learning without interruption. His institutions became the foundation for the first generation of educated families in the region.
                </p>

                <p>
                  His legacy lives on through the countless students who have grown into successful professionals such as <strong className="text-[#0F172A]">engineers, doctors, administrators, and civil servants.</strong>
                </p>

                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mt-6">
                  <p className="text-primary font-semibold italic">
                    "Today, his vision continues under the leadership of his son, ensuring that the institution remains committed to quality education with values and affordability."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-outfit text-xl font-bold text-[#0F172A] mb-3">Compassion</h3>
                <p className="text-[#64748B]">
                  Education for all, regardless of social and economic background
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                  <Award className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-outfit text-xl font-bold text-[#0F172A] mb-3">Excellence</h3>
                <p className="text-[#64748B]">
                  Maintaining high academic standards while keeping education affordable
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-success" />
                </div>
                <h3 className="font-outfit text-xl font-bold text-[#0F172A] mb-3">Vision</h3>
                <p className="text-[#64748B]">
                  Creating opportunities through modern education and traditional values
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Correspondent Message */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="sticky top-24">
                <img 
                  src="https://customer-assets.emergentagent.com/job_resultpro/artifacts/7y6y8szo_WhatsApp%20Image%202026-02-23%20at%203.50.06%20PM.jpeg"
                  alt="Mr. V. Mohan - Correspondent"
                  className="rounded-3xl shadow-xl w-full h-[500px] object-cover"
                  style={{ objectPosition: 'center 20%' }}
                />
                <div className="mt-6 text-center">
                  <h3 className="font-outfit text-2xl font-bold text-[#0F172A]">Mr. V. Mohan</h3>
                  <p className="text-[#64748B] text-lg">Correspondent</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-3xl">
                <h2 className="font-outfit text-3xl font-bold text-[#0F172A] mb-6">Correspondent's Message</h2>
                
                <blockquote className="border-l-4 border-primary pl-6 mb-6 italic text-lg text-primary font-semibold">
                  "Education is the foundation upon which we build the future of our nation."
                </blockquote>

                <div className="space-y-4 text-[#64748B] leading-relaxed">
                  <p>
                    It gives me great pride and satisfaction to address you as the Correspondent of Veera Savarkar Netaji Matriculation School, an institution founded with a noble vision by my father, <strong className="text-[#0F172A]">Shri P. Venugopalan,</strong> a freedom fighter and a dedicated educationist. His dream was to provide quality education to children from all sections of society and to empower them with knowledge, discipline, and strong moral values.
                  </p>

                  <p>
                    Following his footsteps, our mission continues to focus on <strong className="text-[#0F172A]">holistic education</strong> that nurtures intellectual growth, character development, and social responsibility. We strive to create an environment where students are encouraged to think independently, develop confidence, and grow into responsible citizens of our country.
                  </p>

                  <p>
                    In today's rapidly changing world, education must evolve with technology and innovation. With this objective, we have introduced modern learning methods including <strong className="text-[#0F172A]">Smart Class technology, digital teaching tools, and online assessments,</strong> ensuring our students receive the best educational experience while remaining rooted in our cultural heritage and values.
                  </p>

                  <p>
                    We firmly believe that education is a <strong className="text-[#0F172A]">partnership between the school and parents.</strong> Together, we can guide our children toward excellence and prepare them to face future challenges with courage and determination.
                  </p>

                  <p>
                    Our commitment remains unchanged — to provide <strong className="text-[#0F172A]">quality education at affordable fees,</strong> making learning accessible to all while maintaining high academic standards and discipline.
                  </p>

                  <p className="text-[#0F172A] font-semibold pt-4">
                    I sincerely thank all parents for their trust and support and wish every student success in their academic journey and life.
                  </p>

                  <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                    <p className="font-semibold text-[#0F172A]">With Best Wishes,</p>
                    <p className="font-outfit text-xl font-bold text-primary">Mr. V. Mohan</p>
                    <p className="text-sm text-[#64748B]">Correspondent</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principal Message */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="order-2 md:order-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl">
                <h2 className="font-outfit text-3xl font-bold text-[#0F172A] mb-6">Principal's Message</h2>
                
                <blockquote className="border-l-4 border-secondary pl-6 mb-6 italic text-lg text-secondary font-semibold">
                  "Education is not just the learning of facts, but the training of the mind to think and the heart to feel."
                </blockquote>

                <div className="space-y-4 text-[#64748B] leading-relaxed">
                  <p>
                    It gives me immense pleasure to welcome you to Veera Savarkar Netaji Matriculation School, an institution built on strong values, discipline, and academic excellence. Our school stands as a proud legacy of our founder, <strong className="text-[#0F172A]">Shri P. Venugopalan,</strong> whose vision was to provide quality education to every child, irrespective of social and economic background.
                  </p>

                  <p>
                    At our institution, we believe that education is a harmonious blend of <strong className="text-[#0F172A]">knowledge, character, and values.</strong> We are committed not only to academic excellence but also to nurturing responsible citizens with integrity, confidence, and compassion.
                  </p>

                  <p>
                    Our dedicated team of teachers continuously strives to create a <strong className="text-[#0F172A]">stimulating and supportive learning environment</strong> where students can discover their talents and achieve their fullest potential.
                  </p>

                  <p>
                    With the integration of modern teaching methods, smart classrooms, and technology-enabled learning, we ensure that our students are well-prepared to meet the challenges of the future while remaining rooted in cultural values and traditions.
                  </p>

                  <p>
                    We strongly believe that the <strong className="text-[#0F172A]">partnership between parents, teachers, and students</strong> plays a vital role in shaping a child's success. Together, let us guide our children toward a bright future filled with knowledge, confidence, and moral strength.
                  </p>

                  <p className="text-[#0F172A] font-semibold pt-4">
                    I extend my best wishes to all our students for a successful and meaningful academic journey.
                  </p>

                  <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                    <p className="font-semibold text-[#0F172A]">With warm regards,</p>
                    <p className="font-outfit text-xl font-bold text-secondary">Principal Sivapriya</p>
                    <p className="text-sm text-[#64748B]">Principal</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="order-1 md:order-2">
              <div className="sticky top-24">
                <img 
                  src="https://customer-assets.emergentagent.com/job_resultpro/artifacts/nwjpf01z_WhatsApp%20Image%202026-02-23%20at%203.56.28%20PM.jpeg"
                  alt="Principal Sivapriya"
                  className="rounded-3xl shadow-xl w-full h-[500px] object-cover"
                  style={{ objectPosition: 'center 20%' }}
                />
                <div className="mt-6 text-center">
                  <h3 className="font-outfit text-2xl font-bold text-[#0F172A]">Principal Sivapriya</h3>
                  <p className="text-[#64748B] text-lg">Principal</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-outfit text-3xl font-bold mb-4">
            Join Our Legacy of Excellence
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Be part of an institution that has shaped thousands of successful professionals since 1961
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/')}
              className="bg-white text-primary hover:bg-blue-50"
            >
              Explore Our School
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-white text-white hover:bg-white/10"
            >
              Student Portal
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
