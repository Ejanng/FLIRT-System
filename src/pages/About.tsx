import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Heart, Target, Users, Shield, Mail, Github, Twitter } from 'lucide-react';
import { localItemsService } from '../services/localItemsService';
import { localAuthService } from '../services/localAuthService';

export function About() {
  const features = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To reunite people with their lost belongings through a simple, efficient, and community-driven platform.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Built by the community, for the community. Every report helps someone find what they lost.',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your information is protected. We only share contact details when both parties agree.',
    },
  ];

  const team = [
    {
      name: 'Alex Johnson',
      role: 'Product Lead',
      avatar: '👨‍💼',
    },
    {
      name: 'Sarah Chen',
      role: 'Lead Developer',
      avatar: '👩‍💻',
    },
    {
      name: 'Mike Williams',
      role: 'UX Designer',
      avatar: '👨‍🎨',
    },
  ];

  // Get real stats from local storage
  const itemStats = localItemsService.getStats();
  const allUsers = localAuthService.getAllUsers();
  const successRate = itemStats.total > 0 
    ? Math.round(((itemStats.resolved + itemStats.claimed) / itemStats.total) * 100)
    : 0;

  const stats = [
    { value: `${itemStats.total}`, label: 'Items Reported' },
    { value: `${itemStats.resolved + itemStats.claimed}`, label: 'Successful Returns' },
    { value: `${allUsers.length}`, label: 'Active Users' },
    { value: `${successRate}%`, label: 'Success Rate' },
  ];

  return (
    <div className="pb-24 md:pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent/30 to-secondary/50 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="mb-4">About FLIRT</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            FLIRT (Find, Locate, Identify, Recover, Track) is a community-driven platform 
            dedicated to helping people reunite with their lost belongings. We believe that 
            honesty and community support can make a real difference.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center shadow-md">
              <p className="text-3xl font-semibold text-accent-foreground mb-2">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="mb-4">What We Stand For</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our core values guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* How It Started */}
      <div className="bg-secondary/30 border-y border-border py-16 mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="mb-4">How It Started</h2>
          </div>
          <Card className="p-8 shadow-lg">
            <p className="text-muted-foreground mb-4">
              FLIRT was born out of a personal experience. Our founder lost a laptop containing 
              years of work at a coffee shop. Despite posting on multiple platforms and checking 
              lost and found departments, the laptop was never recovered.
            </p>
            <p className="text-muted-foreground mb-4">
              This experience highlighted the need for a dedicated, easy-to-use platform where 
              people could report and search for lost items in one centralized location. We wanted 
              to create something that would make the process simpler and more effective.
            </p>
            <p className="text-muted-foreground">
              Today, FLIRT serves thousands of users, helping reunite people with their belongings 
              and fostering a spirit of community and helpfulness. Every successful return reminds 
              us why we built this platform.
            </p>
          </Card>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The passionate people behind FLIRT
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="p-6 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">{member.avatar}</div>
              <h3 className="mb-1">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 text-center shadow-lg bg-gradient-to-br from-accent/20 to-secondary/40">
          <h2 className="mb-4">Get In Touch</h2>
          <p className="text-muted-foreground mb-8">
            Have questions, suggestions, or feedback? We'd love to hear from you!
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button className="cursor-pointer rounded-full shadow-md">
              <Mail className="w-4 h-4 mr-2" />
              Email Us
            </Button>
            <Button variant="outline" className="cursor-pointer rounded-full border-2">
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" className="cursor-pointer rounded-full border-2">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>

          <p className="text-muted-foreground text-sm">
            Or email us directly at{' '}
            <a href="mailto:hello@flirt.app" className="text-accent-foreground hover:underline">
              hello@flirt.app
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}