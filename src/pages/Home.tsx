import { Link } from 'react-router-dom';
import { Search, FileText, ArrowRight, Users, Heart } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { localItemsService } from '../services/localItemsService';

export function Home() {
  const features = [
    {
      icon: Search,
      title: 'Easy Search',
      description: 'Browse through reported items with powerful filters to find what you lost.',
    },
    {
      icon: FileText,
      title: 'Quick Reporting',
      description: 'Report lost or found items in seconds with our simple form.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by CCIS students, for CCIS students. We help each other.',
    },
  ];

  // Get real stats from local storage
  const itemStats = localItemsService.getStats();
  const allItems = localItemsService.getAllItems();
  const successRate = itemStats.total > 0 
    ? Math.round(((itemStats.resolved + itemStats.claimed) / itemStats.total) * 100)
    : 0;

  const stats = [
    { value: `${itemStats.total}`, label: 'Items Reported' },
    { value: `${itemStats.found}`, label: 'Items Found' },
    { value: `${successRate}%`, label: 'Success Rate' },
  ];

  return (
    <div className="pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-slate-100 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <Search className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl">FLIRT</h1>
            
            {/* Slogan */}
            <p className="text-lg md:text-xl lg:text-2xl text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              <span className="font-semibold text-primary">F</span>inding and{' '}
              <span className="font-semibold text-primary">L</span>ocating lost{' '}
              <span className="font-semibold text-primary">I</span>tems to{' '}
              <span className="font-semibold text-primary">R</span>eturn to{' '}
              <span className="font-semibold text-primary">T</span>heir rightful owners
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/report" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Report Lost Item
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/claim" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl border-2 border-primary bg-white hover:bg-primary hover:text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find My Item
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm md:text-base text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Purpose Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="mb-4">Helping CCIS Students Stay Connected</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              FLIRT is a dedicated platform designed specifically for the CCIS (College of Computer and Information Sciences) 
              community. We understand that losing personal belongings can be stressful, especially during busy academic schedules.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is simple: to reunite students with their lost items quickly and efficiently. Whether you've 
              lost your laptop charger in the library, left your ID in the cafeteria, or found someone's belongings in 
              the classroom, FLIRT makes it easy to report and recover items within our campus community.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-8 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-blue-50 to-slate-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">How FLIRT Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to help you find or return lost items
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <span className="text-3xl text-white font-bold">1</span>
                </div>
                {/* Connector Line - Hidden on mobile */}
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
              </div>
              <h3 className="mb-3">Report</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lost something? Found something? Report it with a quick description and location.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <span className="text-3xl text-white font-bold">2</span>
                </div>
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
              </div>
              <h3 className="mb-3">Search & Match</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse the database to find your item or see if anyone is looking for what you found.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <span className="text-3xl text-white font-bold">3</span>
                </div>
              </div>
              <h3 className="mb-3">Connect & Return</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get in touch with the other party and arrange a safe pickup or return.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Impact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-blue-50 border-2 border-primary/10 shadow-xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="mb-4">Built for Our Community</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              FLIRT was created by CCIS students who understand the challenges of campus life. 
              We believe in the power of community and helping each other succeed. Every item 
              returned is a story of students helping students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl border-2">
                  Learn More About Us
                </Button>
              </Link>
              <Link to="/report">
                <Button size="lg" className="w-full sm:w-auto rounded-xl shadow-lg">
                  Start Helping Today
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}