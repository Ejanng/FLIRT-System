// Local file-based claims service
// Simulates file storage using localStorage

export interface Claim {
  id: number;
  itemId: number;
  claimantId: number;
  claimantEmail: string;
  claimantName: string;
  verificationMessage: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const CLAIMS_FILE_KEY = 'flirt_claims_file';

class LocalClaimsService {
  // Initialize with empty claims file
  private initializeClaimsFile(): void {
    const existingFile = localStorage.getItem(CLAIMS_FILE_KEY);
    if (!existingFile) {
      this.saveClaimsFile([]);
    }
  }

  // Read claims from "file" (localStorage)
  private readClaimsFile(): Claim[] {
    this.initializeClaimsFile();
    const fileContent = localStorage.getItem(CLAIMS_FILE_KEY);
    if (!fileContent) {
      return [];
    }
    try {
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading claims file:', error);
      return [];
    }
  }

  // Write claims to "file" (localStorage)
  private saveClaimsFile(claims: Claim[]): void {
    localStorage.setItem(CLAIMS_FILE_KEY, JSON.stringify(claims, null, 2));
    console.log('📁 Claims file updated:', claims.length, 'claims saved');
  }

  // Get all claims
  getAllClaims(): Claim[] {
    return this.readClaimsFile();
  }

  // Get claim by ID
  getClaimById(id: number): Claim | null {
    const claims = this.readClaimsFile();
    return claims.find(claim => claim.id === id) || null;
  }

  // Get claims by item ID
  getClaimsByItem(itemId: number): Claim[] {
    const claims = this.readClaimsFile();
    return claims.filter(claim => claim.itemId === itemId);
  }

  // Get claims by user
  getClaimsByUser(userId: number): Claim[] {
    const claims = this.readClaimsFile();
    return claims.filter(claim => claim.claimantId === userId);
  }

  // Get claims by status
  getClaimsByStatus(status: Claim['status']): Claim[] {
    const claims = this.readClaimsFile();
    return claims.filter(claim => claim.status === status);
  }

  // Add new claim
  addClaim(claimData: Omit<Claim, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Claim {
    const claims = this.readClaimsFile();
    
    const newClaim: Claim = {
      ...claimData,
      id: claims.length > 0 ? Math.max(...claims.map(c => c.id)) + 1 : 1,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    claims.push(newClaim);
    this.saveClaimsFile(claims);

    console.log('✅ Claim added successfully for item:', newClaim.itemId);
    return newClaim;
  }

  // Update claim
  updateClaim(id: number, updates: Partial<Claim>): Claim | null {
    const claims = this.readClaimsFile();
    const index = claims.findIndex(claim => claim.id === id);

    if (index === -1) {
      console.error('Claim not found:', id);
      return null;
    }

    claims[index] = {
      ...claims[index],
      ...updates,
      id: claims[index].id, // Prevent ID change
      createdAt: claims[index].createdAt, // Prevent createdAt change
      updatedAt: new Date().toISOString(),
    };

    this.saveClaimsFile(claims);
    console.log('✅ Claim updated successfully:', claims[index].id);
    return claims[index];
  }

  // Delete claim
  deleteClaim(id: number): boolean {
    const claims = this.readClaimsFile();
    const filteredClaims = claims.filter(claim => claim.id !== id);

    if (filteredClaims.length === claims.length) {
      console.error('Claim not found:', id);
      return false;
    }

    this.saveClaimsFile(filteredClaims);
    console.log('✅ Claim deleted successfully');
    return true;
  }

  // Get statistics
  getStats(): {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  } {
    const claims = this.readClaimsFile();
    
    return {
      total: claims.length,
      pending: claims.filter(c => c.status === 'pending').length,
      approved: claims.filter(c => c.status === 'approved').length,
      rejected: claims.filter(c => c.status === 'rejected').length,
    };
  }

  // Export claims to downloadable file
  exportClaimsToFile(): void {
    const claims = this.readClaimsFile();
    const dataStr = JSON.stringify(claims, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flirt_claims_backup.json';
    link.click();
    URL.revokeObjectURL(url);
    console.log('📥 Claims file exported');
  }

  // Import claims from file
  async importClaimsFromFile(file: File, mode: 'replace' | 'merge' = 'replace'): Promise<{ success: boolean; error?: string }> {
    try {
      const text = await file.text();
      const newClaims: Claim[] = JSON.parse(text);
      
      // Validate structure
      if (!Array.isArray(newClaims)) {
        return { success: false, error: 'Invalid file format' };
      }

      if (mode === 'replace') {
        this.saveClaimsFile(newClaims);
        console.log('📤 Claims file replaced:', newClaims.length, 'claims');
      } else {
        const existingClaims = this.readClaimsFile();
        const maxId = existingClaims.length > 0 ? Math.max(...existingClaims.map(c => c.id)) : 0;
        
        // Re-assign IDs to avoid conflicts
        const claimsToMerge = newClaims.map((claim, index) => ({
          ...claim,
          id: maxId + index + 1,
        }));
        
        const mergedClaims = [...existingClaims, ...claimsToMerge];
        this.saveClaimsFile(mergedClaims);
        console.log('📤 Claims merged:', claimsToMerge.length, 'new claims added');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Import error:', error);
      return { success: false, error: 'Failed to import file' };
    }
  }

  // Clear all claims
  clearAllClaims(): void {
    localStorage.removeItem(CLAIMS_FILE_KEY);
    console.log('🗑️ All claims cleared');
  }
}

export const localClaimsService = new LocalClaimsService();
