import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Castle, Users, DollarSign, Search, Eye, Plus, Grid3x3, Grid2x2, List, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from '@/hooks/toast';
import ImageAvatar from '@/components/ImageAvatar';
import ClanCard from '@/components/clans/ClanCard';

// Mock data for demonstration
const initialClans = [
  {
    id: 1,
    name: 'The Pain Warriors',
    slug: 'pain-warriors',
    tagline: 'Embrace the grind, unleash the gain',
    description: 'A community of dedicated members turning daily struggles into unstoppable momentum.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&auto=format&fit=crop',
    totalMembers: 1247,
    totalMints: 3420,
    totalEarned: 45000,
    totalEarnedClaimed: 35000,
    badge: 'trending',
    accentColor: 'from-purple-500 to-pink-500',
    creatorAccountId: 1,
    creator: { id: 1, username: 'warrior_chief' } as any,
    socials: {}
  },
  {
    id: 2,
    name: 'Rage Collective',
    slug: 'rage-collective',
    tagline: 'Channel your fury, build your empire',
    description: 'Where anger meets ambition. Join the collective that transforms rage into riches.',
    image: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=400&h=400&auto=format&fit=crop',
    totalMembers: 892,
    totalMints: 2156,
    totalEarned: 67800,
    totalEarnedClaimed: 50000,
    badge: 'top',
    accentColor: 'from-red-500 to-orange-500',
    creatorAccountId: 2,
    creator: { id: 2, username: 'rage_master' } as any,
    socials: {}
  },
  {
    id: 3,
    name: 'Diamond Tears',
    slug: 'diamond-tears',
    tagline: 'Every tear becomes a diamond',
    description: 'Luxury meets resilience. The most exclusive clan for high-value pain miners.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&auto=format&fit=crop',
    totalMembers: 523,
    totalMints: 1840,
    totalEarned: 125000,
    totalEarnedClaimed: 100000,
    badge: 'top',
    accentColor: 'from-cyan-500 to-blue-500',
    creatorAccountId: 3,
    creator: { id: 3, username: 'diamond_chief' } as any,
    socials: {}
  },
  {
    id: 4,
    name: 'Midnight Grinders',
    slug: 'midnight-grinders',
    tagline: 'We work when others sleep',
    description: 'Night owls and hustlers unite. Peak productivity happens after dark.',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&auto=format&fit=crop',
    totalMembers: 678,
    totalMints: 1923,
    totalEarned: 34200,
    totalEarnedClaimed: 25000,
    badge: '',
    accentColor: 'from-indigo-500 to-purple-500',
    creatorAccountId: 4,
    creator: { id: 4, username: 'midnight_owl' } as any,
    socials: {}
  },
  {
    id: 5,
    name: 'Phoenix Rising',
    slug: 'phoenix-rising',
    tagline: 'From ashes to abundance',
    description: 'Rebuilt from rock bottom. This clan celebrates comebacks and second chances.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&auto=format&fit=crop',
    totalMembers: 1105,
    totalMints: 4201,
    totalEarned: 52000,
    totalEarnedClaimed: 40000,
    badge: 'trending',
    accentColor: 'from-yellow-500 to-red-500',
    creatorAccountId: 5,
    creator: { id: 5, username: 'phoenix_leader' } as any,
    socials: {}
  },
  {
    id: 6,
    name: 'Chaos Squad',
    slug: 'chaos-squad',
    tagline: 'Order from chaos',
    description: 'The wildest minds creating the most value. Controlled chaos at its finest.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&auto=format&fit=crop',
    totalMembers: 445,
    totalMints: 982,
    totalEarned: 28000,
    totalEarnedClaimed: 20000,
    badge: 'new',
    accentColor: 'from-green-500 to-teal-500',
    creatorAccountId: 6,
    creator: { id: 6, username: 'chaos_chief' } as any,
    socials: {}
  },
];

const Clans2 = () => {
  
  const [clans, setClans] = useState(initialClans);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Form state
  const [newClan, setNewClan] = useState({
    name: '',
    tagline: '',
    description: '',
    image: '',
    worth: ''
  });

  // Calculate stats
  const stats = useMemo(() => {
    const totalClans = clans.length;
    const totalMembers = clans.reduce((sum, clan) => sum + clan.totalMembers, 0);
    const totalEarned = clans.reduce((sum, clan) => sum + clan.totalEarned, 0);
    const averageEarned = totalClans > 0 ? Math.round(totalEarned / totalClans) : 0;
    
    return { totalClans, totalMembers, totalEarned, averageEarned };
  }, [clans]);

  // Filter and sort clans
  const filteredAndSortedClans = useMemo(() => {
    let result = [...clans];
    
    // Filter by search
    if (searchQuery) {
      result = result.filter(clan => 
        clan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clan.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id - a.id;
      } else if (sortBy === 'totalMembers') {
        return b.totalMembers - a.totalMembers;
      } else if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    
    return result;
  }, [clans, searchQuery, sortBy]);

  const handleCreateClan = () => {
    if (!newClan.name || !newClan.tagline) {
      toast.info("Missing Information");
      return;
    }

    const accentColors = [
      'from-purple-500 to-pink-500',
      'from-red-500 to-orange-500',
      'from-cyan-500 to-blue-500',
      'from-indigo-500 to-purple-500',
      'from-yellow-500 to-red-500',
      'from-green-500 to-teal-500',
    ];

    const randomAccent = accentColors[Math.floor(Math.random() * accentColors.length)];

    const clan = {
      id: clans.length + 1,
      name: newClan.name,
      slug: newClan.name.toLowerCase().replace(/\s+/g, '-'),
      tagline: newClan.tagline,
      description: newClan.description || 'A new clan ready to conquer.',
      image: newClan.image || '🏰',
      totalMembers: 1,
      totalMints: 0,
      totalEarned: parseInt(newClan.worth) || 0,
      totalEarnedClaimed: 0,
      badge: 'new' as const,
      accentColor: randomAccent,
      creatorAccountId: 999,
      creator: { id: 999, username: 'you' } as any,
      socials: {}
    };

    setClans([...clans, clan]);
    setIsCreateDialogOpen(false);
    setNewClan({ name: '', tagline: '', description: '', image: '', worth: '' });
    
    toast.success("🎉 Clan Created!");
  };


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2">
                Clans
              </h1>
              <p className="text-muted-foreground text-lg">Build your community, grow your empire</p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Clan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Create Your Clan</DialogTitle>
                  <DialogDescription>
                    Build a community around your values and vision
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="name">Clan Name *</Label>
                    <Input
                      id="name"
                      placeholder="The Pain Warriors"
                      value={newClan.name}
                      onChange={(e) => setNewClan({ ...newClan, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Image/Logo (emoji or URL)</Label>
                    <Input
                      id="image"
                      placeholder="🏰"
                      value={newClan.image}
                      onChange={(e) => setNewClan({ ...newClan, image: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline *</Label>
                    <Input
                      id="tagline"
                      placeholder="Embrace the grind, unleash the gain"
                      value={newClan.tagline}
                      onChange={(e) => setNewClan({ ...newClan, tagline: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell the world what your clan stands for..."
                      value={newClan.description}
                      onChange={(e) => setNewClan({ ...newClan, description: e.target.value })}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateClan}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
                  >
                    Create Clan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Castle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Clans Created</h3>
              </div>
              <p className="text-3xl font-black text-foreground">{stats.totalClans}</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Members</h3>
              </div>
              <p className="text-3xl font-black text-foreground">{stats.totalMembers.toLocaleString()}</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Average Earned</h3>
              </div>
              <p className="text-3xl font-black text-foreground">{stats.averageEarned.toLocaleString()}</p>
            </div>
          </div>

          {/* Filter & Sort Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-8">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Input
                  placeholder="Search Groups"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 h-12 rounded-xl"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-lg transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Tabs value={sortBy} onValueChange={setSortBy} className="w-auto">
                <TabsList className="bg-background border border-border h-12">
                  <TabsTrigger value="newest" className="data-[state=active]:bg-card">Newly Created</TabsTrigger>
                  <TabsTrigger value="totalMembers" className="data-[state=active]:bg-card">Most Members</TabsTrigger>
                  <TabsTrigger value="alphabetical" className="data-[state=active]:bg-card">Alphabetical</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="hidden lg:flex items-center gap-2 border border-border rounded-xl p-1">
                <button className="p-2 rounded-lg bg-card hover:bg-accent transition-colors">
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                  <Grid2x2 className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Clans Grid */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filteredAndSortedClans.map((clan) => (
               <ClanCard clan={clan} />
            ))}
          </div>

          {filteredAndSortedClans.length === 0 && (
            <div className="text-center py-16">
              <Castle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-foreground mb-2">No clans found</h3>
              <p className="text-muted-foreground">Try adjusting your search or create a new clan</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Clans2;