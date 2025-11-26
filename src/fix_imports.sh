#!/bin/bash

# Fix version-specific imports in UI component files
# This script removes version numbers from package imports

echo "======================================================================"
echo "Fixing version-specific imports in UI components"
echo "======================================================================"
echo ""

# Check if components/ui directory exists
if [ ! -d "components/ui" ]; then
    echo "Error: components/ui directory not found!"
    echo "Please run this script from the project root."
    exit 1
fi

# Counter for changes
total_files=0
total_changes=0

# Fix all .tsx files in components/ui
for file in components/ui/*.tsx; do
    if [ -f "$file" ]; then
        echo "Fixing: $file"
        
        # Create backup
        cp "$file" "$file.bak"
        
        # Fix imports (preserve react-hook-form@7.55.0 and sonner@2.0.3)
        sed -i.tmp \
            -e 's/@radix-ui\/react-\([a-z-]*\)@[0-9.]*"/@radix-ui\/react-\1"/g' \
            -e 's/lucide-react@[0-9.]*"/lucide-react"/g' \
            -e 's/class-variance-authority@[0-9.]*"/class-variance-authority"/g' \
            -e 's/cmdk@[0-9.]*"/cmdk"/g' \
            -e 's/vaul@[0-9.]*"/vaul"/g' \
            -e 's/input-otp@[0-9.]*"/input-otp"/g' \
            -e 's/react-day-picker@[0-9.]*"/react-day-picker"/g' \
            -e 's/embla-carousel-react@[0-9.]*"/embla-carousel-react"/g' \
            -e 's/recharts@[0-9.]*"/recharts"/g' \
            -e 's/react-resizable-panels@[0-9.]*"/react-resizable-panels"/g' \
            -e 's/next-themes@[0-9.]*"/next-themes"/g' \
            "$file"
        
        # Remove temp file
        rm -f "$file.tmp"
        
        # Check if file changed
        if ! diff -q "$file" "$file.bak" > /dev/null 2>&1; then
            echo "  ✓ Fixed imports"
            ((total_changes++))
        else
            echo "  - No changes needed"
        fi
        
        # Remove backup
        rm -f "$file.bak"
        
        ((total_files++))
    fi
done

echo ""
echo "======================================================================"
echo "Summary: Fixed imports in $total_changes out of $total_files files"
echo "======================================================================"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:5173"
echo ""
