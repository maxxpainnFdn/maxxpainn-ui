
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Share2, Users, DollarSign, Trophy, CheckCircle } from 'lucide-react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import toast from '@/hooks/toast';

const Referral = () => {
  const [copied, setCopied] = useState(false);
  
  // Mock referral code - in real app this would come from user account
  const referralCode = "PAIN2024MAXX";
  const referralLink = `https://maxxpainn.com/mint?ref=${referralCode}`;
  
  // Mock stats data
  const stats = {
    totalReferrals: 42,
    totalEarnings: 1250.75,
    pendingEarnings: 150.25,
    conversionRate: 68.5
  };
  
  // Mock referred mints data
  const referredMints = [
    { id: 1, user: "0x7a2b...c4d5", amount: 1000, lockPeriod: 90, earnings: 25.0, date: "2024-06-28", status: "confirmed" },
    { id: 2, user: "0x9f3e...a1b2", amount: 2500, lockPeriod: 180, earnings: 62.5, date: "2024-06-27", status: "confirmed" },
    { id: 3, user: "0x4c7d...8e9f", amount: 500, lockPeriod: 30, earnings: 12.5, date: "2024-06-26", status: "pending" },
    { id: 4, user: "0x1a5b...f2c3", amount: 3000, lockPeriod: 365, earnings: 75.0, date: "2024-06-25", status: "confirmed" },
    { id: 5, user: "0x8d4e...b7c1", amount: 1500, lockPeriod: 60, earnings: 37.5, date: "2024-06-24", status: "confirmed" }
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard");
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join MAXX PAINN - Turn Your Pain Into Power!',
        text: 'Experience the ultimate pain-to-earn crypto platform. Use my referral code for exclusive benefits!',
        url: referralLink,
      });
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4">
              <span className="gradient-text">REFERRAL</span>{" "}
              <span className="text-red-600">PROGRAM</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Share the pain, earn the gain. Get 2.5% of every mint your referrals make!
            </p>
          </div>

          {/* Referral Code Section */}
          <Card className="bg-gray-900 border-purple-500/20 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold gradient-text">Your Referral Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-black border border-purple-500/30 rounded-lg p-4">
                  <div className="text-2xl font-mono text-purple-400">{referralCode}</div>
                </div>
                <Button
                  onClick={copyReferralCode}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-black border border-purple-500/30 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Referral Link:</div>
                  <div className="text-purple-400 break-all">{referralLink}</div>
                </div>
                <Button
                  onClick={shareReferral}
                  variant="outline"
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Referrals</p>
                    <p className="text-3xl font-bold text-purple-400">{stats.totalReferrals}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-400">${stats.totalEarnings}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-yellow-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending Earnings</p>
                    <p className="text-3xl font-bold text-yellow-400">${stats.pendingEarnings}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Conversion Rate</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.conversionRate}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referred Mints Table */}
          <Card className="bg-gray-900 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold gradient-text">Your Referred Mints</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Amount (PAINN)</TableHead>
                    <TableHead className="text-gray-300">Lock Period</TableHead>
                    <TableHead className="text-gray-300">Your Earnings</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referredMints.map((mint) => (
                    <TableRow key={mint.id} className="border-gray-700 hover:bg-gray-800/50">
                      <TableCell className="font-mono text-purple-400">{mint.user}</TableCell>
                      <TableCell className="text-white font-bold">{mint.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-300">{mint.lockPeriod} days</TableCell>
                      <TableCell className="text-green-400 font-bold">${mint.earnings}</TableCell>
                      <TableCell className="text-gray-300">{mint.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          mint.status === 'confirmed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {mint.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Referral;
