import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  TrendingUp, 
  Package, 
  CheckCircle, 
  Clock, 
  Shield,
  Eye,
  Trash2,
  CheckCheck,
  XCircle,
  MoreVertical,
  Search,
  Download
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { customToast } from '../components/ToastProvider';
import { AdminAnalytics } from '../components/AdminAnalyticsSimple';
import { localItemsService, type LostItem } from '../services/localItemsService';
import { localClaimsService, type Claim } from '../services/localClaimsService';
import { localAuthService } from '../services/localAuthService';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  reportsCount: number;
  claimsCount: number;
  joinDate: string;
  status: 'active' | 'suspended';
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      customToast.error('Access Denied', 'You do not have permission to access the admin dashboard');
      navigate('/');
    }
  }, [user, navigate]);

  // Data for reports
  const [reports, setReports] = useState<LostItem[]>([]);

  // Data for claims
  const [claims, setClaims] = useState<Claim[]>([]);

  // Data for users
  const [users, setUsers] = useState<User[]>([]);

  // Calculate real-time stats from actual data
  const stats = [
    {
      label: 'Total Reports',
      value: reports.length.toString(),
      change: '+12.5%',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Pending Claims',
      value: claims.filter(c => c.status === 'pending').length.toString(),
      change: '+5.2%',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Resolved',
      value: reports.filter(r => r.status === 'resolved').length.toString(),
      change: '+18.3%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Active Users',
      value: users.filter(u => u.status === 'active').length.toString(),
      change: '+24.1%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  // Action handlers
  const handleVerify = (reportId: string) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, status: 'verified' as const } : r
    ));
    customToast.success('Report Verified', 'The report has been verified successfully');
  };

  const handleVerifyReport = (reportId: string) => {
    handleVerify(reportId);
  };

  const handleReject = (reportId: string) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, status: 'rejected' as const } : r
    ));
    customToast.warning('Report Rejected', 'The report has been rejected');
  };

  const handleRejectReport = (reportId: string) => {
    handleReject(reportId);
  };

  const openDeleteDialog = (item: Report | User | Claim) => {
    setReportToDelete(item.id);
  };

  const handleApproveClaim = (claimId: string) => {
    setClaims(claims.map(c => 
      c.id === claimId ? { ...c, status: 'approved' as const } : c
    ));
    customToast.success('Claim Approved', 'The claim has been approved successfully');
  };

  const handleRejectClaim = (claimId: string) => {
    setClaims(claims.map(c => 
      c.id === claimId ? { ...c, status: 'rejected' as const } : c
    ));
    customToast.warning('Claim Rejected', 'The claim has been rejected');
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: 'suspended' as const } : u
    ));
    customToast.warning('User Suspended', 'The user has been suspended');
  };

  const handleActivateUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: 'active' as const } : u
    ));
    customToast.success('User Activated', 'The user has been activated');
  };

  const handleDelete = () => {
    if (reportToDelete) {
      setReports(reports.filter(r => r.id !== reportToDelete));
      customToast.success('Report Deleted', 'The report has been permanently deleted');
      setReportToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      pending: { className: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Pending' },
      verified: { className: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Verified' },
      resolved: { className: 'bg-green-100 text-green-700 border-green-200', label: 'Resolved' },
      rejected: { className: 'bg-red-100 text-red-700 border-red-200', label: 'Rejected' },
      approved: { className: 'bg-green-100 text-green-700 border-green-200', label: 'Approved' },
      active: { className: 'bg-green-100 text-green-700 border-green-200', label: 'Active' },
      suspended: { className: 'bg-red-100 text-red-700 border-red-200', label: 'Suspended' },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant="outline" className={`rounded-full ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const filteredReports = reports.filter(report =>
    report.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Load items from local storage
    const allItems = localItemsService.getAllItems();
    setReports(allItems);

    // Load claims from local storage
    const allClaims = localClaimsService.getAllClaims();
    setClaims(allClaims);

    // Load users from local storage (with mock data for now since users don't have reports/claims count)
    const allUsers = localAuthService.getAllUsers();
    const usersWithStats: User[] = allUsers.map((user, index) => ({
      id: `U-${String(user.id).padStart(3, '0')}`,
      name: user.name,
      email: user.email,
      role: user.role,
      reportsCount: allItems.filter(item => item.reportedById === user.id).length,
      claimsCount: allClaims.filter(claim => claim.claimantId === user.id).length,
      joinDate: user.createdAt.split('T')[0],
      status: 'active',
    }));
    setUsers(usersWithStats);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <h1 className="mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage and monitor the FLIRT system</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50/30">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl md:text-3xl font-semibold">{stat.value}</p>
                <span className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card className="mb-6 shadow-lg">
          <div className="p-4 md:p-6 border-b border-border bg-gradient-to-r from-blue-50 to-slate-50">
            <TabsList className="bg-white shadow-md h-auto flex-wrap justify-start gap-2 p-2">
              <TabsTrigger 
                value="reports" 
                className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-lg px-4 py-2"
              >
                <Package className="w-4 h-4 mr-2" />
                All Reports
              </TabsTrigger>
              <TabsTrigger 
                value="claims"
                className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-lg px-4 py-2"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Verify Claims
              </TabsTrigger>
              <TabsTrigger 
                value="users"
                className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-lg px-4 py-2"
              >
                <Shield className="w-4 h-4 mr-2" />
                Manage Users
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-lg px-4 py-2"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          {/* View All Reports Tab */}
          <TabsContent value="reports" className="p-0 m-0">
            <div className="p-4 md:p-6">
              {/* Search and Actions */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
                <Button variant="outline" className="rounded-xl border-2">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-border shadow-md">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-100 to-slate-100">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Report ID</th>
                      <th className="text-left p-4 font-semibold text-foreground">Item</th>
                      <th className="text-left p-4 font-semibold text-foreground">Type</th>
                      <th className="text-left p-4 font-semibold text-foreground">Reporter</th>
                      <th className="text-left p-4 font-semibold text-foreground">Location</th>
                      <th className="text-left p-4 font-semibold text-foreground">Date</th>
                      <th className="text-left p-4 font-semibold text-foreground">Status</th>
                      <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report, index) => (
                      <tr 
                        key={report.id}
                        className={`border-t border-border transition-colors hover:bg-blue-50/50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                      >
                        <td className="p-4 font-mono text-sm">{report.id}</td>
                        <td className="p-4">{report.itemName}</td>
                        <td className="p-4">
                          <Badge variant={report.type === 'lost' ? 'destructive' : 'default'} className="rounded-full">
                            {report.type === 'lost' ? 'Lost' : 'Found'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{report.reporter}</div>
                            <div className="text-sm text-muted-foreground">{report.email}</div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{report.location}</td>
                        <td className="p-4 text-sm">{new Date(report.date).toLocaleDateString()}</td>
                        <td className="p-4">{getStatusBadge(report.status)}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {report.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleVerifyReport(report.id)}
                                  className="rounded-lg bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-400/90"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verify
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectReport(report.id)}
                                  className="rounded-lg border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem className="cursor-pointer rounded-lg">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer text-destructive rounded-lg"
                                  onClick={() => openDeleteDialog(report)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {reports.map((report) => (
                  <Card key={report.id} className="p-4 shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-mono text-sm text-muted-foreground mb-1">{report.id}</p>
                        <h4 className="mb-1">{report.itemName}</h4>
                        <div className="flex gap-2 mb-2">
                          <Badge variant={report.type === 'lost' ? 'destructive' : 'default'} className="rounded-full">
                            {report.type === 'lost' ? 'Lost' : 'Found'}
                          </Badge>
                          {getStatusBadge(report.status)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Reporter: </span>
                        <span className="font-medium">{report.reporter}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location: </span>
                        <span>{report.location}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date: </span>
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {report.status === 'pending' && (
                      <div className="flex gap-2 mb-2">
                        <Button
                          size="sm"
                          onClick={() => handleVerify(report.id)}
                          className="flex-1 rounded-lg bg-gradient-to-r from-primary to-blue-400"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(report.id)}
                          className="flex-1 rounded-lg border-2"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 rounded-lg">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setReportToDelete(report.id)}
                        className="rounded-lg border-2 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Verify Claims Tab */}
          <TabsContent value="claims" className="p-0 m-0">
            <div className="p-4 md:p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search claims..."
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-border shadow-md">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-100 to-slate-100">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Claim ID</th>
                      <th className="text-left p-4 font-semibold text-foreground">Item</th>
                      <th className="text-left p-4 font-semibold text-foreground">Claimant</th>
                      <th className="text-left p-4 font-semibold text-foreground">Reporter</th>
                      <th className="text-left p-4 font-semibold text-foreground">Date</th>
                      <th className="text-left p-4 font-semibold text-foreground">Status</th>
                      <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim, index) => (
                      <tr 
                        key={claim.id}
                        className={`border-t border-border transition-colors hover:bg-blue-50/50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                      >
                        <td className="p-4 font-mono text-sm">{claim.id}</td>
                        <td className="p-4">{claim.itemName}</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{claim.claimant}</div>
                            <div className="text-sm text-muted-foreground">{claim.email}</div>
                          </div>
                        </td>
                        <td className="p-4">{claim.reporter}</td>
                        <td className="p-4 text-sm">{new Date(claim.date).toLocaleDateString()}</td>
                        <td className="p-4">{getStatusBadge(claim.status)}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {claim.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveClaim(claim.id)}
                                  className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectClaim(claim.id)}
                                  className="rounded-lg border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem className="cursor-pointer rounded-lg">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer text-destructive rounded-lg"
                                  onClick={() => openDeleteDialog(claim)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {claims.map((claim) => (
                  <Card key={claim.id} className="p-4 shadow-md">
                    <div className="mb-3">
                      <p className="font-mono text-sm text-muted-foreground mb-1">{claim.id}</p>
                      <h4 className="mb-2">{claim.itemName}</h4>
                      {getStatusBadge(claim.status)}
                    </div>
                    <div className="space-y-2 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Claimant: </span>
                        <span className="font-medium">{claim.claimant}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reporter: </span>
                        <span>{claim.reporter}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date: </span>
                        <span>{new Date(claim.date).toLocaleDateString()}</span>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Verification:</p>
                        <p className="text-sm">{claim.verificationMessage}</p>
                      </div>
                    </div>
                    {claim.status === 'pending' && (
                      <div className="flex gap-2 mb-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveClaim(claim.id)}
                          className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectClaim(claim.id)}
                          className="flex-1 rounded-lg border-2"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 rounded-lg">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openDeleteDialog(claim)}
                        className="rounded-lg border-2 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Manage Users Tab */}
          <TabsContent value="users" className="p-0 m-0">
            <div className="p-4 md:p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-border shadow-md">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-100 to-slate-100">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">User ID</th>
                      <th className="text-left p-4 font-semibold text-foreground">Name</th>
                      <th className="text-left p-4 font-semibold text-foreground">Email</th>
                      <th className="text-left p-4 font-semibold text-foreground">Role</th>
                      <th className="text-left p-4 font-semibold text-foreground">Reports</th>
                      <th className="text-left p-4 font-semibold text-foreground">Claims</th>
                      <th className="text-left p-4 font-semibold text-foreground">Status</th>
                      <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr 
                        key={user.id}
                        className={`border-t border-border transition-colors hover:bg-blue-50/50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                      >
                        <td className="p-4 font-mono text-sm">{user.id}</td>
                        <td className="p-4 font-medium">{user.name}</td>
                        <td className="p-4 text-sm">{user.email}</td>
                        <td className="p-4">
                          <Badge 
                            variant={user.role === 'admin' ? 'default' : 'secondary'} 
                            className="rounded-full capitalize"
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">{user.reportsCount}</td>
                        <td className="p-4 text-center">{user.claimsCount}</td>
                        <td className="p-4">{getStatusBadge(user.status)}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {user.status === 'active' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSuspendUser(user.id)}
                                className="rounded-lg border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Suspend
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleActivateUser(user.id)}
                                className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Activate
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem className="cursor-pointer rounded-lg">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer text-destructive rounded-lg"
                                  onClick={() => openDeleteDialog(user)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {users.map((user) => (
                  <Card key={user.id} className="p-4 shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-mono text-sm text-muted-foreground mb-1">{user.id}</p>
                        <h4 className="mb-1">{user.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                        <div className="flex gap-2">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="rounded-full capitalize">
                            {user.role}
                          </Badge>
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3 p-3 bg-blue-50 rounded-lg">
                      <div>
                        <span className="text-muted-foreground block">Reports</span>
                        <span className="font-semibold">{user.reportsCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Claims</span>
                        <span className="font-semibold">{user.claimsCount}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspendUser(user.id)}
                          className="flex-1 rounded-lg border-2"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleActivateUser(user.id)}
                          className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Activate
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="rounded-lg">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openDeleteDialog(user)}
                        className="rounded-lg border-2 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="p-0 m-0">
            <div className="p-4 md:p-6">
              <AdminAnalytics data={{
                totalItems: reports.length,
                totalClaims: claims.length,
                claimsVerified: claims.filter(c => c.status === 'approved').length,
                claimsRejected: claims.filter(c => c.status === 'rejected').length,
                claimsPending: claims.filter(c => c.status === 'pending').length,
                itemsReturned: reports.filter(r => r.status === 'resolved').length,
                recoveryRate: reports.length > 0 
                  ? Math.round((reports.filter(r => r.status === 'resolved').length / reports.length) * 100 * 10) / 10
                  : 0,
              }} />
            </div>
          </TabsContent>
        </Card>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!reportToDelete} onOpenChange={() => setReportToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected report from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}