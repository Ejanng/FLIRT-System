// Local file-based items service
// Simulates file storage using localStorage

import { generateDummyItems } from '../utils/generateDummyData';

export interface LostItem {
  id: number;
  itemName: string;
  category: string;
  description: string;
  location: string;
  dateLost: string;
  imageUrl?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'lost' | 'found' | 'claimed' | 'resolved';
  reportedBy: string; // User email
  reportedById: number; // User ID
  reportedAt: string;
  updatedAt: string;
}

const ITEMS_FILE_KEY = 'flirt_items_file';

class LocalItemsService {
  // Initialize with sample items if file doesn't exist
  private initializeItemsFile(): void {
    const existingFile = localStorage.getItem(ITEMS_FILE_KEY);
    if (!existingFile) {
      // Load from JSON file instead of generating
      const sampleItems: LostItem[] = generateDummyItems() as LostItem[];
      this.saveItemsFile(sampleItems);
    }
  }

  // Load dummy items from JSON file
  private loadDummyItemsFromJSON(): LostItem[] {
    return generateDummyItems() as LostItem[];
  }

  // Read items from "file" (localStorage)
  private readItemsFile(): LostItem[] {
    this.initializeItemsFile();
    const fileContent = localStorage.getItem(ITEMS_FILE_KEY);
    if (!fileContent) {
      return [];
    }
    try {
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading items file:', error);
      return [];
    }
  }

  // Write items to "file" (localStorage)
  private saveItemsFile(items: LostItem[]): void {
    localStorage.setItem(ITEMS_FILE_KEY, JSON.stringify(items, null, 2));
    console.log('📁 Items file updated:', items.length, 'items saved');
  }

  // Get all items
  getAllItems(): LostItem[] {
    return this.readItemsFile();
  }

  // Get item by ID
  getItemById(id: number): LostItem | null {
    const items = this.readItemsFile();
    return items.find(item => item.id === id) || null;
  }

  // Get items by status
  getItemsByStatus(status: LostItem['status']): LostItem[] {
    const items = this.readItemsFile();
    return items.filter(item => item.status === status);
  }

  // Get items by user
  getItemsByUser(userId: number): LostItem[] {
    const items = this.readItemsFile();
    return items.filter(item => item.reportedById === userId);
  }

  // Search items
  searchItems(query: string, filters?: {
    category?: string;
    location?: string;
    status?: LostItem['status'];
  }): LostItem[] {
    let items = this.readItemsFile();

    // Apply text search
    if (query) {
      const lowerQuery = query.toLowerCase();
      items = items.filter(item =>
        item.itemName.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.location.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply filters
    if (filters?.category) {
      items = items.filter(item => item.category === filters.category);
    }
    if (filters?.location) {
      items = items.filter(item => item.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters?.status) {
      items = items.filter(item => item.status === filters.status);
    }

    return items;
  }

  // Add new item
  addItem(itemData: Omit<LostItem, 'id' | 'reportedAt' | 'updatedAt'>): LostItem {
    const items = this.readItemsFile();
    
    const newItem: LostItem = {
      ...itemData,
      id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    items.push(newItem);
    this.saveItemsFile(items);

    console.log('✅ Item added successfully:', newItem.itemName);
    return newItem;
  }

  // Update item
  updateItem(id: number, updates: Partial<LostItem>): LostItem | null {
    const items = this.readItemsFile();
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      console.error('Item not found:', id);
      return null;
    }

    items[index] = {
      ...items[index],
      ...updates,
      id: items[index].id, // Prevent ID change
      reportedAt: items[index].reportedAt, // Prevent reportedAt change
      updatedAt: new Date().toISOString(),
    };

    this.saveItemsFile(items);
    console.log('✅ Item updated successfully:', items[index].itemName);
    return items[index];
  }

  // Delete item
  deleteItem(id: number): boolean {
    const items = this.readItemsFile();
    const filteredItems = items.filter(item => item.id !== id);

    if (filteredItems.length === items.length) {
      console.error('Item not found:', id);
      return false;
    }

    this.saveItemsFile(filteredItems);
    console.log('✅ Item deleted successfully');
    return true;
  }

  // Get statistics
  getStats(): {
    total: number;
    lost: number;
    found: number;
    claimed: number;
    resolved: number;
    byCategory: Record<string, number>;
  } {
    const items = this.readItemsFile();
    
    const stats = {
      total: items.length,
      lost: items.filter(i => i.status === 'lost').length,
      found: items.filter(i => i.status === 'found').length,
      claimed: items.filter(i => i.status === 'claimed').length,
      resolved: items.filter(i => i.status === 'resolved').length,
      byCategory: {} as Record<string, number>,
    };

    // Count by category
    items.forEach(item => {
      stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
    });

    return stats;
  }

  // Export items to downloadable file
  exportItemsToFile(): void {
    const items = this.readItemsFile();
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flirt_items_backup.json';
    link.click();
    URL.revokeObjectURL(url);
    console.log('📥 Items file exported');
  }

  // Import items from file
  async importItemsFromFile(file: File, mode: 'replace' | 'merge' = 'replace'): Promise<{ success: boolean; error?: string }> {
    try {
      const text = await file.text();
      const newItems: LostItem[] = JSON.parse(text);
      
      // Validate structure
      if (!Array.isArray(newItems)) {
        return { success: false, error: 'Invalid file format' };
      }

      if (mode === 'replace') {
        this.saveItemsFile(newItems);
        console.log('📤 Items file replaced:', newItems.length, 'items');
      } else {
        const existingItems = this.readItemsFile();
        const maxId = existingItems.length > 0 ? Math.max(...existingItems.map(i => i.id)) : 0;
        
        // Re-assign IDs to avoid conflicts
        const itemsToMerge = newItems.map((item, index) => ({
          ...item,
          id: maxId + index + 1,
        }));
        
        const mergedItems = [...existingItems, ...itemsToMerge];
        this.saveItemsFile(mergedItems);
        console.log('📤 Items merged:', itemsToMerge.length, 'new items added');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Import error:', error);
      return { success: false, error: 'Failed to import file' };
    }
  }

  // Clear all items
  clearAllItems(): void {
    localStorage.removeItem(ITEMS_FILE_KEY);
    console.log('🗑️ All items cleared');
  }

  // Reinitialize with fresh dummy data (267 items, 67% success rate)
  reinitializeWithDummyData(): void {
    const dummyItems = generateDummyItems();
    this.saveItemsFile(dummyItems);
    console.log('🔄 Database reinitialized with', dummyItems.length, 'dummy items');
    
    // Calculate and log statistics
    const stats = this.getStats();
    const successRate = ((stats.claimed + stats.resolved) / stats.total * 100).toFixed(1);
    console.log('📊 Statistics:', {
      total: stats.total,
      successful: stats.claimed + stats.resolved,
      pending: stats.lost + stats.found,
      successRate: `${successRate}%`
    });
  }
}

export const localItemsService = new LocalItemsService();