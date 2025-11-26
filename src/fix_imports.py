#!/usr/bin/env python3
"""
Fix version-specific imports in UI component files.
This script removes version numbers from package imports (except for special cases).
"""

import re
import os
from pathlib import Path

# Packages that MUST keep their version numbers
KEEP_VERSIONS = [
    'react-hook-form@7.55.0',
    'sonner@2.0.3'
]

def fix_import_line(line):
    """Remove version numbers from imports, except for special cases."""
    # Skip lines that should keep versions
    for keep_pkg in KEEP_VERSIONS:
        if keep_pkg in line:
            return line
    
    # Pattern to match: package-name@version.number"
    # Replace with: package-name"
    line = re.sub(r'(@[a-z0-9-]+/[a-z0-9-]+)@[0-9.]+(["\'])', r'\1\2', line)
    line = re.sub(r'([a-z0-9-]+)@[0-9.]+(["\'])', r'\1\2', line)
    
    return line

def fix_file(filepath):
    """Fix all imports in a single file."""
    print(f"Fixing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixed_lines = []
    changes = 0
    
    for line in lines:
        fixed_line = fix_import_line(line)
        if fixed_line != line:
            changes += 1
        fixed_lines.append(fixed_line)
    
    if changes > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(fixed_lines)
        print(f"  ✓ Fixed {changes} import(s)")
    else:
        print(f"  - No changes needed")
    
    return changes

def main():
    """Main function to fix all UI component files."""
    print("=" * 60)
    print("Fixing version-specific imports in UI components")
    print("=" * 60)
    print()
    
    ui_dir = Path('components/ui')
    
    if not ui_dir.exists():
        print(f"Error: {ui_dir} directory not found!")
        print("Please run this script from the project root.")
        return 1
    
    total_files = 0
    total_changes = 0
    
    # Find all .tsx files in components/ui
    for tsx_file in ui_dir.glob('*.tsx'):
        changes = fix_file(tsx_file)
        total_files += 1
        total_changes += changes
    
    print()
    print("=" * 60)
    print(f"Summary: Fixed {total_changes} imports in {total_files} files")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Run: npm run dev")
    print("2. Open: http://localhost:5173")
    print()
    
    return 0

if __name__ == '__main__':
    exit(main())
