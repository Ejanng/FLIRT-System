import { Card } from './ui/card';
import { TrendingUp, Package, CheckCircle, Users, Calendar, MapPin } from 'lucide-react';

interface AnalyticsData {
  totalItems: number;
  totalClaims: number;
  claimsVerified: number;
  claimsRejected: number;
  claimsPending: number;
  itemsReturned: number;
  recoveryRate: number;
}

interface AdminAnalyticsProps {
  data?: AnalyticsData;
}

export function AdminAnalytics({ data }: AdminAnalyticsProps) {
  const analyticsData: AnalyticsData = data || {
    totalItems: 156,
    totalClaims: 89,
    claimsVerified: 62,
    claimsRejected: 15,
    claimsPending: 12,
    itemsReturned: 58,
    recoveryRate: 69.7,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#5B8FB9] to-[#7FAFD9] rounded-lg flex items-center justify-center shadow-md">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-[#1F2937]">Analytics Dashboard</h2>
          <p className="text-sm text-[#6B7280]">Overview of lost and found activities</p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Items Reported */}
        <Card className="p-6 bg-gradient-to-br from-[#5B8FB9] to-[#7FAFD9] text-white border-none shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-white/80 mb-1">Total Items Reported</p>
              <h3 className="text-3xl font-bold">{analyticsData.totalItems}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-white/80 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12% from last month</span>
          </p>
        </Card>

        {/* Total Claims Verified */}
        <Card className="p-6 bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Claims Verified</p>
              <h3 className="text-3xl font-bold text-[#1F2937]">{analyticsData.claimsVerified}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-[#6B7280]">
            Out of {analyticsData.totalClaims} total claims
          </p>
        </Card>

        {/* Recovery Rate */}
        <Card className="p-6 bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Recovery Rate</p>
              <h3 className="text-3xl font-bold text-[#1F2937]">{analyticsData.recoveryRate}%</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#5B8FB9]" />
            </div>
          </div>
          <p className="text-xs text-[#6B7280]">
            {analyticsData.itemsReturned} items successfully returned
          </p>
        </Card>

        {/* Pending Claims */}
        <Card className="p-6 bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Pending Review</p>
              <h3 className="text-3xl font-bold text-[#1F2937]">{analyticsData.claimsPending}</h3>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-[#6B7280]">
            Requires immediate attention
          </p>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <Card className="p-6 bg-white border border-[#E5E7EB] shadow-sm">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Items by Category</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Electronics</span>
              <span className="font-semibold text-[#5B8FB9]">42</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Clothing</span>
              <span className="font-semibold text-[#5B8FB9]">35</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Accessories</span>
              <span className="font-semibold text-[#5B8FB9]">28</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Bags</span>
              <span className="font-semibold text-[#5B8FB9]">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Keys</span>
              <span className="font-semibold text-[#5B8FB9]">15</span>
            </div>
          </div>
        </Card>

        {/* Status Breakdown */}
        <Card className="p-6 bg-white border border-[#E5E7EB] shadow-sm">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Claim Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Verified</span>
              <span className="font-semibold text-green-600">{analyticsData.claimsVerified}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Pending</span>
              <span className="font-semibold text-orange-600">{analyticsData.claimsPending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Rejected</span>
              <span className="font-semibold text-red-600">{analyticsData.claimsRejected}</span>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 bg-white border border-[#E5E7EB] shadow-sm">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">This Week</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Items Reported</span>
              <span className="font-semibold text-[#5B8FB9]">86</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Claims Filed</span>
              <span className="font-semibold text-[#5B8FB9]">52</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Items Returned</span>
              <span className="font-semibold text-green-600">38</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#5B8FB9]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Avg. Response Time</p>
              <p className="text-xl font-semibold text-[#1F2937]">2.4 days</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Success Rate</p>
              <p className="text-xl font-semibold text-[#1F2937]">93.5%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Top Location</p>
              <p className="text-xl font-semibold text-[#1F2937]">Library</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
