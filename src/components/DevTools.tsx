import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { localAuthService } from '../services/localAuthService';
import { localItemsService } from '../services/localItemsService';
import { Download, Upload, Eye, Code, Trash2, Package } from 'lucide-react';
import { customToast } from './ToastProvider';

export function DevTools() {
  const [users, setUsers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const handleViewUsers = () => {
    const allUsers = localAuthService.getAllUsers();
    setUsers(allUsers);
    setShowUsers(true);
    customToast.success('Users Loaded', `Found ${allUsers.length} users in local storage`);
  };

  const handleViewItems = () => {
    const allItems = localItemsService.getAllItems();
    setItems(allItems);
    setShowItems(true);
    customToast.success('Items Loaded', `Found ${allItems.length} items in local storage`);
  };

  const handleExportUsers = () => {
    localAuthService.exportUsersToFile();
    customToast.success('Export Complete', 'Users file downloaded successfully');
  };

  const handleExportItems = () => {
    localItemsService.exportItemsToFile();
    customToast.success('Export Complete', 'Items file downloaded successfully');
  };

  const handleImportUsers = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await localAuthService.importUsersFromFile(file);
    if (result.success) {
      customToast.success('Import Complete', 'Users file imported successfully');
      handleViewUsers(); // Refresh the list
    } else {
      customToast.error('Import Failed', result.error || 'Failed to import file');
    }
    e.target.value = ''; // Reset input
  };

  const handleImportItems = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await localItemsService.importItemsFromFile(file, 'replace');
    if (result.success) {
      customToast.success('Import Complete', 'Items file imported successfully');
      handleViewItems(); // Refresh the list
    } else {
      customToast.error('Import Failed', result.error || 'Failed to import file');
    }
    e.target.value = ''; // Reset input
  };

  const handleClearUsers = () => {
    if (confirm('⚠️ Are you sure you want to clear all users? This will reset to default admin only.')) {
      localStorage.removeItem('flirt_users_file');
      customToast.success('Users Cleared', 'Local storage reset. Page will reload.');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleClearItems = () => {
    if (confirm('⚠️ Are you sure you want to clear all items? This will reset to sample items.')) {
      localStorage.removeItem('flirt_items_file');
      customToast.success('Items Cleared', 'Local storage reset. Page will reload.');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleReinitializeWithDummyData = () => {
    if (confirm('🔄 This will replace all items with 267 dummy items (67% success rate). Continue?')) {
      localItemsService.reinitializeWithDummyData();
      customToast.success('Database Reinitialized', '267 dummy items loaded with 67% success rate. Page will reload.');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const stats = localItemsService.getStats();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-24 md:bottom-6 right-6 z-50 bg-[#5B8FB9] text-white hover:bg-[#4A7A9F] shadow-lg border-0"
        >
          <Code className="w-4 h-4 mr-2" />
          Dev Tools
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full md:w-[640px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-[#5B8FB9]" />
            Developer Tools - Local File Manager
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="users" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">👥 Users</TabsTrigger>
            <TabsTrigger value="items">📦 Items</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            {/* File Operations */}
            <Card className="p-4 border-[#D8E6F3]">
              <h3 className="font-semibold text-[#1F2937] mb-3">User File Operations</h3>
              <div className="space-y-2">
                <Button
                  onClick={handleViewUsers}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Users File (localStorage)
                </Button>

                <Button
                  onClick={handleExportUsers}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Users to JSON File
                </Button>

                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportUsers}
                    id="import-users-file"
                    className="hidden"
                  />
                  <Button
                    onClick={() => document.getElementById('import-users-file')?.click()}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Users from JSON File
                  </Button>
                </div>

                <Button
                  onClick={handleClearUsers}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Users (Reset)
                </Button>
              </div>
            </Card>

            {/* Users Display */}
            {showUsers && (
              <Card className="p-4 border-[#D8E6F3]">
                <h3 className="font-semibold text-[#1F2937] mb-3">
                  Users File Contents ({users.length} users)
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="p-3 bg-[#F8FAFB] rounded-lg border border-[#E5E7EB]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#1F2937]">{user.name}</span>
                        <span className="text-xs bg-[#D8E6F3] text-[#5B8FB9] px-2 py-1 rounded">
                          {user.role}
                        </span>
                      </div>
                      <div className="text-sm text-[#6B7280] space-y-1">
                        <p>📧 {user.email}</p>
                        <p>🔑 {user.password}</p>
                        <p className="text-xs">ID: {user.id}</p>
                        <p className="text-xs">
                          Created: {new Date(user.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Info */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-[#1F2937] mb-2 text-sm">
                ℹ️ About Local File Storage
              </h3>
              <div className="text-xs text-[#6B7280] space-y-2">
                <p>
                  This app uses <strong>localStorage</strong> to simulate local file storage.
                  User credentials are saved in your browser's storage.
                </p>
                <p>
                  <strong>Default Admin Account:</strong><br />
                  Email: admin@ccis.edu<br />
                  Password: password123
                </p>
                <p className="text-yellow-700 bg-yellow-50 p-2 rounded">
                  ⚠️ Note: Passwords are stored in plain text for development. In
                  production, always use proper encryption (bcrypt).
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="space-y-4">
            {/* Stats Card */}
            <Card className="p-4 border-[#D8E6F3] bg-gradient-to-br from-blue-50 to-white">
              <h3 className="font-semibold text-[#1F2937] mb-3">📊 Items Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280]">Total Items</p>
                  <p className="text-2xl font-bold text-[#5B8FB9]">{stats.total}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280]">Lost</p>
                  <p className="text-2xl font-bold text-red-600">{stats.lost}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280]">Found</p>
                  <p className="text-2xl font-bold text-green-600">{stats.found}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280]">Resolved</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.resolved}</p>
                </div>
              </div>
            </Card>

            {/* File Operations */}
            <Card className="p-4 border-[#D8E6F3]">
              <h3 className="font-semibold text-[#1F2937] mb-3">Item File Operations</h3>
              <div className="space-y-2">
                <Button
                  onClick={handleViewItems}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Items File (localStorage)
                </Button>

                <Button
                  onClick={handleExportItems}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Items to JSON File
                </Button>

                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportItems}
                    id="import-items-file"
                    className="hidden"
                  />
                  <Button
                    onClick={() => document.getElementById('import-items-file')?.click()}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Items from JSON File
                  </Button>
                </div>

                <Button
                  onClick={handleClearItems}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Items (Reset)
                </Button>

                <Button
                  onClick={handleReinitializeWithDummyData}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Reinitialize with Dummy Data
                </Button>
              </div>
            </Card>

            {/* Items Display */}
            {showItems && (
              <Card className="p-4 border-[#D8E6F3]">
                <h3 className="font-semibold text-[#1F2937] mb-3">
                  Items File Contents ({items.length} items)
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#F8FAFB] rounded-lg border border-[#E5E7EB]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#1F2937]">{item.itemName}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            item.status === 'lost' ? 'bg-red-100 text-red-700' :
                            item.status === 'found' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="text-sm text-[#6B7280] space-y-1">
                        <p>📦 {item.category}</p>
                        <p>📍 {item.location}</p>
                        <p>📅 {new Date(item.dateLost).toLocaleDateString()}</p>
                        <p className="text-xs">👤 {item.reportedBy}</p>
                        <p className="text-xs">ID: {item.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Info */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-[#1F2937] mb-2 text-sm">
                ℹ️ About Dummy Data
              </h3>
              <div className="text-xs text-[#6B7280] space-y-2">
                <p>
                  Click <strong>"Reinitialize with Dummy Data"</strong> to load 267 sample items into localStorage.
                </p>
                <p className="bg-white p-2 rounded border border-blue-200">
                  <strong>Statistics:</strong><br />
                  • Total Items: 267<br />
                  • Success Rate: 67% (179 items resolved/claimed)<br />
                  • Pending: 33% (88 items lost/found)<br />
                  • Categories: 8 different types<br />
                  • Locations: 16 campus locations
                </p>
                <p>
                  Use <strong>"Export Items to JSON File"</strong> to download the current database to a JSON file that you can save and import later.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}